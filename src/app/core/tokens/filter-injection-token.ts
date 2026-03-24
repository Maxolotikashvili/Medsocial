import { Signal } from "@angular/core";

export abstract class FilterItem {
    abstract label: Signal<string>;
    abstract inputValue: Signal<string | number>;
}