import { Lookup } from "./Lookup.model";

export class Guid {
    static newGuid = function () {

        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    static emptyGuid = function () {
        return '00000000-0000-0000-0000-000000000000';
    }
}

export class ModifyDate {

    static changeDateDb = function (oldDate: any) {
        if (oldDate !== null && oldDate !== undefined) {
            const newDate = oldDate.split('-');
            return newDate[2] + '/' + newDate[1] + '/' + newDate[0];
        }
    }

    static changeDateView = function (date: any) {
        if (date !== null && date !== undefined) {
            const newDate = date.split('/');
            return newDate[2] + '-' + newDate[1] + '-' + newDate[0];
        }
    }

}

export class validateDate {

    static validateMaxDate = function (date: any, maxDate: any): boolean {
        if (date && maxDate && date <= maxDate)
            return true;
        else
            return false;
    }

}

export class LookupModifier {

    static LookupLoad = function (data: any) {
        let lookup: Lookup[] = [];

        let keys = Object.keys(data);
        keys.forEach(k => {
            let newLookup: Lookup = { valueKey: '', descr: '' };
            newLookup.valueKey = k;
            newLookup.descr = data[k];
            lookup.push(newLookup);
        });
        return lookup;
    }

}