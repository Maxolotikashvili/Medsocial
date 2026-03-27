export function removeDuplicates(target: (string | number)[]): (string | number)[] {
    return [...new Set(target)];
}