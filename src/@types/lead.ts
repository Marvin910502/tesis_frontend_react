// import { User } from 'src/@types/user'
// import { Attachment } from 'src/@types/attachment'
// import { Many2One } from 'src/@types/relational_fileds'
export interface StateLead {
    id: number
    name: string
    collapsed?: boolean
}
export interface Lead {
  id: number
  name: string
  type: 'lead'|'opportunity'
  active?: boolean
  email_from?: string
  phone?: string
  mobile?: string
  street?: string
  street2?: string
  city?: string
  zip?: string
  state_id?: StateLead

}
