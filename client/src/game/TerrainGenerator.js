import { createNoise2D } from 'simplex-noise';

export const TILE_VARIANTS = {
    TERRAIN: {
        grass: { id: 0 },
        dirt: { id: 5 },
        mountain: { id: 23 },
        WATER: {
            water: { id: 133 },
            water_edge_top: { id: 117 },
            water_edge_bottom: { id: 149 },
            water_edge_left: { id: 132 },
            water_edge_right: { id: 134 },
            water_corner_topleft: { id: 116 },
            water_corner_topright: { id: 118 },
            water_corner_bottomleft: { id: 148 },
            water_corner_bottomright: { id: 150 },
        }
    },
    RESOURCES: {
        tree_trunk: { id: 42 },
        tree_top: { id: 26 },
    }
};


export class TerrainGenerator {
    constructor() {

    }

    generateTerrainPerlinNoise(width, height) {
        const noise = createNoise2D();
        let terrain = [];
        for (let y = 0; y < height; y++) {
            terrain[y] = [];
            for (let x = 0; x < width; x++) {
                const value = noise(x / 20, y / 20);
                if (value < -0.7) {
                    terrain[y][x] = TILE_VARIANTS.TERRAIN.WATER.water.id;
                } else if (value < 0) {
                    terrain[y][x] = TILE_VARIANTS.TERRAIN.grass.id;
                } else if (value < 0.3) {
                    terrain[y][x] = TILE_VARIANTS.TERRAIN.dirt.id;
                } else {
                    terrain[y][x] = TILE_VARIANTS.TERRAIN.mountain.id;
                }
            }
        }

        terrain = this.smoothTerrain(terrain, 2);
        terrain = this.removeSmallWaterBodies(terrain, 30); // Adjust minimum size as needed
        terrain = this.applyWaterEdges(terrain);

        return terrain;
    }

    addTrees(terrain, treeDensity = 0.05) {
        const width = terrain[0].length;
        const height = terrain.length;

        const treePositions = [];

        for (let y = 1; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (terrain[y][x] === TILE_VARIANTS.TERRAIN.grass.id && Math.random() < treeDensity) {
                    // check there is room for the tree (trunk on this tile and treetop on the tile above)
                    if (y > 0 && terrain[y - 1][x] === TILE_VARIANTS.TERRAIN.grass.id) {
                        treePositions.push({ x, y });
                    }
                }
            }
        }

        return treePositions;
    }

    smoothTerrain(terrain, passes = 2) {
        const width = terrain[0].length;
        const height = terrain.length;
        const smoothed = JSON.parse(JSON.stringify(terrain));

        for (let pass = 0; pass < passes; pass++) {
            for (let y = 1; y < height - 1; y++) {
                for (let x = 1; x < width - 1; x++) {
                    const neighbors = [
                        terrain[y - 1][x], terrain[y + 1][x],
                        terrain[y][x - 1], terrain[y][x + 1]
                    ];
                    const mostCommon = neighbors.sort((a, b) =>
                        neighbors.filter(v => v === a).length
                        - neighbors.filter(v => v === b).length
                    ).pop();
                    smoothed[y][x] = mostCommon;
                }
            }
            terrain = JSON.parse(JSON.stringify(smoothed));
        }
        return terrain;
    }

    removeSmallWaterBodies(terrain, minSize) {
        const width = terrain[0].length;
        const height = terrain.length;
        const visited = Array(height).fill().map(() => Array(width).fill(false));

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (terrain[y][x] === TILE_VARIANTS.TERRAIN.WATER.water.id && !visited[y][x]) {
                    const waterBody = this.floodFill(terrain, x, y, visited);
                    if (waterBody.length < minSize) {
                        waterBody.forEach(([wx, wy]) => {
                            terrain[wy][wx] = TILE_VARIANTS.TERRAIN.grass.id;
                        });
                    }
                }
            }
        }

        return terrain
    }

    //  identify and measure the size of water bodies
    floodFill(terrain, startX, startY, visited) {
        const width = terrain[0].length;
        const height = terrain.length;
        const waterBody = [];
        const stack = [[startX, startY]];

        while (stack.length > 0) {
            const [x, y] = stack.pop();
            if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x] || terrain[y][x] !== TILE_VARIANTS.TERRAIN.WATER.water.id) {
                continue;
            }

            visited[y][x] = true;
            waterBody.push([x, y]);

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        return waterBody;
    }

    applyWaterEdges(terrain) {
        for (let y = 0; y < terrain.length; y++) {
            for (let x = 0; x < terrain[y].length; x++) {
                if (terrain[y][x] === TILE_VARIANTS.TERRAIN.WATER.water.id) {
                    terrain[y][x] = this.getWaterEdgeTile(terrain, x, y);
                }
            }
        }

        return terrain
    }

    getTile(terrain, x, y) {
        if (x < 0 || y < 0 || x >= terrain[0].length || y >= terrain.length) {
            return null;
        }
        return terrain[y][x];
    }

    getWaterEdgeTile(terrain, x, y) {
        const waterTiles = [
            TILE_VARIANTS.TERRAIN.WATER.water.id,
            TILE_VARIANTS.TERRAIN.WATER.water_edge_top.id,
            TILE_VARIANTS.TERRAIN.WATER.water_edge_bottom.id,
            TILE_VARIANTS.TERRAIN.WATER.water_edge_left.id,
            TILE_VARIANTS.TERRAIN.WATER.water_edge_right.id,
            TILE_VARIANTS.TERRAIN.WATER.water_corner_topleft.id,
            TILE_VARIANTS.TERRAIN.WATER.water_corner_topright.id,
            TILE_VARIANTS.TERRAIN.WATER.water_corner_bottomleft.id,
            TILE_VARIANTS.TERRAIN.WATER.water_corner_bottomright.id
        ];

        const isWater = (x, y) => {
            const tile = this.getTile(terrain, x, y);
            return tile !== null && waterTiles.includes(tile);
        };

        const top = isWater(x, y - 1);
        const bottom = isWater(x, y + 1);
        const left = isWater(x - 1, y);
        const right = isWater(x + 1, y);

        const topLeft = isWater(x - 1, y - 1);
        const topRight = isWater(x + 1, y - 1);
        const bottomLeft = isWater(x - 1, y + 1);
        const bottomRight = isWater(x + 1, y + 1);

        if (!top && left && right) {
            return TILE_VARIANTS.TERRAIN.WATER.water_edge_top.id;
        }
        if (!bottom && left && right) {
            return TILE_VARIANTS.TERRAIN.WATER.water_edge_bottom.id;
        }
        if (!left && top && bottom) {
            return TILE_VARIANTS.TERRAIN.WATER.water_edge_left.id;
        }
        if (!right && top && bottom) {
            return TILE_VARIANTS.TERRAIN.WATER.water_edge_right.id;
        }

        // Then handle corners
        if (!top && !left && !topLeft) {
            return TILE_VARIANTS.TERRAIN.WATER.water_corner_topleft.id;
        }
        if (!top && !right && !topRight) {
            return TILE_VARIANTS.TERRAIN.WATER.water_corner_topright.id;
        }
        if (!bottom && !left && !bottomLeft) {
            return TILE_VARIANTS.TERRAIN.WATER.water_corner_bottomleft.id;
        }
        if (!bottom && !right && !bottomRight) {
            return TILE_VARIANTS.TERRAIN.WATER.water_corner_bottomright.id;
        }


        return TILE_VARIANTS.TERRAIN.WATER.water.id;
    }
}