import { createNoise2D } from 'simplex-noise';

const TILE_VARIANTS = {
    grass: { id: 16 },
    dirt: { id: 156 },
    mountain: { id: 291 },
    water: { id: 61 },
    water_edge_top: { id: 46 },
    water_edge_bottom: { id: 76 },
    water_edge_left: { id: 60 },
    water_edge_right: { id: 62 },
    water_corner_topleft: { id: 45 },
    water_corner_topright: { id: 47 },
    water_corner_bottomleft: { id: 75 },
    water_corner_bottomright: { id: 77 }
};


export default class TerrainGenerator {
    constructor() {

    }

    generateTerrainPerlinNoise(width, height) {
        const noise = createNoise2D();
        const terrain = [];
        for (let y = 0; y < height; y++) {
            terrain[y] = [];
            for (let x = 0; x < width; x++) {
                const value = noise(x / 20, y / 20);
                if (value < -0.6) {
                    terrain[y][x] = TILE_VARIANTS.water.id;
                } else if (value < 0) {
                    terrain[y][x] = TILE_VARIANTS.grass.id;
                } else if (value < 0.5) {
                    terrain[y][x] = TILE_VARIANTS.dirt.id;
                } else {
                    terrain[y][x] = TILE_VARIANTS.mountain.id;
                }
            }
        }

        this.applyWaterEdges(terrain);

        return terrain;
    }

    applyWaterEdges(terrain) {
        for (let y = 0; y < terrain.length; y++) {
            for (let x = 0; x < terrain[y].length; x++) {
                if (terrain[y][x] === TILE_VARIANTS.water.id) {
                    terrain[y][x] = this.getWaterEdgeTile(terrain, x, y);
                }
            }
        }
    }

    getTile(terrain, x, y) {
        if (x < 0 || y < 0 || x >= terrain[0].length || y >= terrain.length) {
            return null;
        }
        return terrain[y][x];
    }

    getWaterEdgeTile(terrain, x, y) {
        const waterTiles = [
            TILE_VARIANTS.water.id,
            TILE_VARIANTS.water_edge_top.id,
            TILE_VARIANTS.water_edge_bottom.id,
            TILE_VARIANTS.water_edge_left.id,
            TILE_VARIANTS.water_edge_right.id,
            TILE_VARIANTS.water_corner_topleft.id,
            TILE_VARIANTS.water_corner_topright.id,
            TILE_VARIANTS.water_corner_bottomleft.id,
            TILE_VARIANTS.water_corner_bottomright.id
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


        // First handle simple edges
        if (!top) {
            return TILE_VARIANTS.water_edge_top.id;
        }

        if (!right && !top) {
            return TILE_VARIANTS.water_edge_right.id
        }

        if (!top && !right) {
            return TILE_VARIANTS.water_edge_right.id;

        }

        if (!bottom) {
            return TILE_VARIANTS.water_edge_bottom.id;
        }
        // if (bottom && !left && !right) {
        //     return TILE_VARIANTS.water_edge_bottom.id;
        // }
        // if (left && !top && !bottom) {
        //     return TILE_VARIANTS.water_edge_left.id;
        // }
        // if (right && !top && !bottom) {
        //     return TILE_VARIANTS.water_edge_right.id;
        // }

        // // Then handle corners
        // if (top && left && !topLeft) {
        //     return TILE_VARIANTS.water_corner_topleft.id;
        // }
        // if (top && right && !topRight) {
        //     return TILE_VARIANTS.water_corner_topright.id;
        // }
        // if (bottom && left && !bottomLeft) {
        //     return TILE_VARIANTS.water_corner_bottomleft.id;
        // }
        // if (bottom && right && !bottomRight) {
        //     return TILE_VARIANTS.water_corner_bottomright.id;
        // }

        // Default to water
        return TILE_VARIANTS.water.id;
    }
}