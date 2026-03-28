export function filterObjectWithValues(obj: Partial<Record<string, any>>) {
    const filteredObject: Record<string, any> = {};

    const objKeys = Object.keys(obj);

    for (let key of objKeys) {
        if (obj[key]) {
            filteredObject[key] = obj[key];
        }
    }

    return filteredObject;
}