// ----------------------------------------------------------------------

export interface ContextUser {
  lang: 'es_ES' | 'en_US' | 'it_IT' | 'de_DE';
  tz:
    | 'Europe/Rome'
    | 'Europe/Paris'
    | 'Europe/Berlin'
    | 'Europe/Madrid'
    | false;
}
export interface UserCompany {
  current_company: [number, string];
  allowed_company_ids: [number, string][];
}
export interface User {
  uid: number;
  partner_id: number;
  company_id: number;
  name: string;
  username: string;
  is_admin: boolean;
  user_context: ContextUser;
  user_companies: UserCompany;
}
export function getAvatar (uid : number) {
  return `${window.location.origin}/web/image?model=res.users&field=image_128&id=${uid}`
}
