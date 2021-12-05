import { FormMessage } from './FormMessage.model';

export interface JsonDataResponse {
    oprNo: number;
    status: number;
    messages: FormMessage[];
    url: string;
}
