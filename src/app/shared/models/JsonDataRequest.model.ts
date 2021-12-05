import { MetaData } from './MetaData.model';

export interface JsonDataRequest {
    metadata: MetaData;
    objectdata: any[];
}
