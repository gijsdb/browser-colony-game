import { uniqueNamesGenerator, names } from 'unique-names-generator';

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

export const generateColonistName = () => {
    return uniqueNamesGenerator({
        dictionaries: [names],
        length: 1,
        separator: ' ',

    })
}