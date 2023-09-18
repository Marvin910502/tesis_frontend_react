import { Attachment } from 'src/@types/attachment'

export function getAttachmentUrl(attachment: Attachment) {
	return (
		`${process.env.VITE_APP_HOST_API_KEY}${attachment.local_url}` ||
    `/web/image/${attachment.id}`
	)
}
export function getAttachmentUrlById(id: number) {
	return `${process.env.VITE_APP_HOST_API_KEY}/web/content/${id}`
}

export function getPreviewIcon(type: string) {
	console.log(type)
	switch (type) {
	case 'application/pdf':
		return '/icons/ic_pdf.svg'
	case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
		return '/icons/ic_word.svg'
	case 'text/csv':
	case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
		return '/icons/ic_excel.svg'

	case 'image/png':
	case 'image/jpeg':
	case 'image/jpg':
	case 'image/gif':
	case 'image/svg+xml':
	case 'image/webp':
	case 'image/bmp':
	case 'image/tiff':
		return '/icons/ic_image.svg'

	default:
		return '/icons/ic_unknow.svg'
	}
}
