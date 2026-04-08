import { Signal, WritableSignal } from "@angular/core";
import { DropdownOption } from "../models/dropdown.model";

export abstract class FilterItem {
    abstract label: Signal<string>;
    abstract inputValue: WritableSignal<DropdownOption>;
}