export interface DropdownOption<T = any> {
    value: T,
    id?: string | number;
    [key: string] : any
}