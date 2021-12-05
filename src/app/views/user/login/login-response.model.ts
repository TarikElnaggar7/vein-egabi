import { Lookup } from '../../../shared/models/Lookup.model';
import { FormMessage } from 'src/app/shared/models/FormMessage.model';

export interface LoginResponse {
    fstLogin: number;
    usrNo: number;
    userName: string;
    userPassword: string;
    token: string;
    userDescr: string;
    status: number;
    messages: FormMessage[];
    roles: Lookup[];
}
