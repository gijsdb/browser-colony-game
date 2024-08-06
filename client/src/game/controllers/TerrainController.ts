import { createNoise2D } from 'simplex-noise';

interface TILE_VARIANTSI {
    TERRAIN: {
        grass: { id: number },
        dirt: { id: number },
        mountain: { id: number },
        WATER: {
            water: { id: number},
            water_edge_top: { id: number},
            water_edge_bottom: { id: number},
            water_edge_left: { id: number},
            water_edge_right: { id: number},
            water_corner_topleft: { id: number},
            water_corner_topright: { id: number},
            water_corner_bottomleft: { id: number},
            water_corner_bottomright: { id: number},
        }
    },
    RESOURCES: {
        tree_trunk: { id: number },
        tree_top: { id: number },
        long_grass_one: { id: number },
        long_grass_two: { id: number },
        berries: { id: number },
        mushroom: { id: number }
    },
    DECORATION: {
        tree_stump: { id: number },
        flowers: { id: number }
    }
};


export const TILE_VARIANTS: TILE_VARIANTSI = {
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
        long_grass_one: { id: 45 },
        long_grass_two: { id: 50 },
        berries: { id: 52 },
        mushroom: { id: 13 }
    },
    DECORATION: {
        tree_stump: { id: 54 },
        flowers: { id: 2 }
    }
};

export type Terrain = number[][];

export class TerrainController {
    constructor() {
 
    }

    generateTerrainPerlinNoise(width: number, height: number) : Terrain {
        const noise = createNoise2D();
        let terrain: Terrain = [];
        for (let y = 0; y < height; y++) {
            terrain[y] = [];
            for (let x = 0; x < width; x++) {
                const value = noise(x / 35, y / 35);
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

    addResources(terrain: Terrain, treeDensity = 0.05) : Terrain {
        const width = terrain[0].length;
        const height = terrain.length;
        const resourcePositions = [];

        for (let y = 1; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (terrain[y][x] === TILE_VARIANTS.TERRAIN.grass.id && Math.random() < treeDensity) {
                    // Check if there's room for the tree (trunk on this tile and treetop on the tile above)
                    if (y > 0 &&
                        terrain[y - 1][x] === TILE_VARIANTS.TERRAIN.grass.id &&
                        !this.isResourceNearby(resourcePositions, x, y)) {

                        let num = Math.random()
                        if (num < 0.1) {
                            terrain[y][x] = TILE_VARIANTS.RESOURCES.long_grass_one.id
                        } else if (num < 0.2 && num > 0.1) {
                            terrain[y][x] = TILE_VARIANTS.RESOURCES.long_grass_two.id
                        } else if (num < 0.3 && num > 0.2) {
                            terrain[y][x] = TILE_VARIANTS.RESOURCES.berries.id

                        } else if (num < 0.4 && num > 0.3) {
                            terrain[y][x] = TILE_VARIANTS.RESOURCES.mushroom.id
                        } else {
                            terrain[y - 1][x] = TILE_VARIANTS.RESOURCES.tree_top.id
                            terrain[y][x] = TILE_VARIANTS.RESOURCES.tree_trunk.id
                        }
                        resourcePositions.push({ x, y });
                    }
                }
            }
        }
        return terrain;
    }

    addDecoration(terrain: Terrain): Terrain {
        const width = terrain[0].length;
        const height = terrain.length;

        for (let y = 1; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (terrain[y][x] === TILE_VARIANTS.TERRAIN.grass.id && Math.random() < 0.2) {
                    let num = Math.random()
                    if (num < 0.05) {
                        terrain[y][x] = TILE_VARIANTS.DECORATION.tree_stump.id
                    } else if (num < 0.1 && num > 0.05) {
                        terrain[y][x] = TILE_VARIANTS.DECORATION.flowers.id
                    }
                }
            }
        }
        return terrain;
    }

    // Check if there's a resource in the immediate vicinity (including diagonals)
    isResourceNearby(resourcePositions: Array<any>, x: number, y: number) : boolean {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (resourcePositions.some(resource => resource.x === x + i && resource.y === y + j)) {
                    return true;
                }
            }
        }
        return false;
    }

    smoothTerrain(terrain: Terrain, passes = 2): Terrain {
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

    removeSmallWaterBodies(terrain: Terrain, minSize: number) : Terrain {
        const width = terrain[0].length;
        const height = terrain.length;
        const visited = Array(height).fill(false).map(() => Array(width).fill(false));

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
    floodFill(terrain: Terrain, startX:number, startY:number, visited: Array<any>): number[][] {
        const width = terrain[0].length;
        const height = terrain.length;
        const waterBody = [];
        const stack = [[startX, startY]];

        while (stack.length > 0) {
            const [x, y] = stack.pop() || [0,0];
            if (x < 0 || x >= width || y < 0 || y >= height || visited[y][x] || terrain[y][x] !== TILE_VARIANTS.TERRAIN.WATER.water.id) {
                continue;
            }

            visited[y][x] = true;
            waterBody.push([x, y]);

            stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
        }

        return waterBody;
    }

    applyWaterEdges(terrain: Terrain) : Terrain {
        for (let y = 0; y < terrain.length; y++) {
            for (let x = 0; x < terrain[y].length; x++) {
                if (terrain[y][x] === TILE_VARIANTS.TERRAIN.WATER.water.id) {
                    terrain[y][x] = this.getWaterEdgeTile(terrain, x, y);
                }
            }
        }

        return terrain
    }

    getTile(terrain:Array<any>, x: number, y: number) {
        if (x < 0 || y < 0 || x >= terrain[0].length || y >= terrain.length) {
            return null;
        }
        return terrain[y][x];
    }

    getWaterEdgeTile(terrain: Terrain, x: number, y: number): number {
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

        const isWater = (x: number, y: number) => {
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