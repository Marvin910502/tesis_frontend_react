export interface Message {
  id: number
  body?: string
  author_id: [number, string]
  attachment_ids?: [number, string][]
  subject?: string
  date: string
  message_type:
    | 'email'
    | 'comment'
    | 'notification'
    | 'user_notification'
    | 'sms'
  model?: string
  res_id?: number
  partner_ids?: [number, string][]
  subtype_description?: string
}

export const subTypesMessages = {
	'mail.mt_comment': 1,
	'mail.mt_note': 2,
	'mail.mt_activities': 3,
	'mail.mt_activity': 4,
	'mail.mt_meeting': 5,
	'mail.mt_task': 6,
}

export interface MailActivity {
  id: number
  activity_type_id: [number, string]
  activity_category:
    | 'default'
    | 'meeting'
    | 'other'
    | 'upload_file'
    | 'upload_image'
    | 'upload_video'
  summary: string
  icon: string
  res_id: number
  res_model: string
  activity_decoration: 'warning' | 'danger' | 'success' | 'primary' | 'info'
  state: 'overdue' | 'today' | 'planned'
  date_deadline: string
  user_id: [number, string]
  calendar_event_id: [number, string]
  note: string
}
