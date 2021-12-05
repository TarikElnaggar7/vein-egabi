export interface Lookup {
    valueKey: string;
    descr: string;
};

export class CheckBoxModel {
    valueKey: string = undefined;
    descr: string = undefined;
    selected: boolean = false;
}
