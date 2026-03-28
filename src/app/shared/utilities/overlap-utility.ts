export function detectValueMatch(value1: string | number, value2: string | number): boolean {
    const dereivedValue1: string = value1.toString().toLowerCase();
    const dereivedValue2: string = value2.toString().toLowerCase();

    const match = dereivedValue1.includes(dereivedValue2) || dereivedValue2.includes(dereivedValue1);

    return match;
}