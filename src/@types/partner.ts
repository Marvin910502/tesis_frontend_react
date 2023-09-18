// import { Many2One } from 'src/@types/relational_fileds'

export interface Partner{
  id:number;
  name:string;
  email:string;
  country_id?:[number, string];
  zip?:string;
  street?:string;
  state_id?:[number, string];
  city?:string;
  vat?:string;

}
