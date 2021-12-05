export interface FormAttribute {
    controlName: {
        componentId: number;
        controlId: number;
        minlength: number;
        maxlength: number;
        controlName: string;
        labelDescr: string;
        toolTip: string;
        justification: string;
        caseRestriction: string;
        formatMask: string;
        local: string;
        initialValue: string;
        visible: boolean;
        enable: boolean;
        dataType: string;
        mandatory: boolean;
        conceal: boolean;
        controlPk: boolean;
        multiLine: boolean;
        minValue: number;
        maxValue: number;
    };
}
