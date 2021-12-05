import { FormAttribute } from './FormAttribute.model';
import { FormMessage } from './FormMessage.model';

export interface FormLoadResponse {
  pageName: string;
  oprNo: number;
  insert: number;
  update: number;
  delete: number;
  query: number;
  confirm: number;
  rollback: number;
  print: number;
  status: number;
  token: string;
  attributes: FormAttribute[];
  messages: FormMessage[];

}
