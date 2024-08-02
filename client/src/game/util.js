export const isTileIdInObject = (tileId, obj) => {
    for (const key in obj) {
        if (obj[key].id === tileId) {
            return true;
        }
        if (obj[key] && typeof obj[key] === 'object') {
            if (isTileIdInObject(tileId, obj[key])) {
                return true;
            }
        }
    }
    return false;
}
