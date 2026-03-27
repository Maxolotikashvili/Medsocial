import { Signal, WritableSignal } from "@angular/core";

export abstract class FilterItem {
    abstract label: Signal<string>;
    abstract inputValue: WritableSignal<string | number>;
}