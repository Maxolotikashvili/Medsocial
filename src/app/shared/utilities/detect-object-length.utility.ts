export function getObjectLengthBy(by: 'keys' | 'values', obj: Record<string, any>): number {
    if (by === 'keys') {
        return Object.keys(obj).length;
    } else {
        const keys = Object.keys(obj);
        const arr = []; 
        keys.forEach((key) => {
            if (obj[key]) {
                arr.push(obj[key]);
            }
        })

        return arr.length;
    }
}