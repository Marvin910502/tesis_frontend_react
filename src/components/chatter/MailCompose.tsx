import { useState } from 'react'
// @mui
import { styled } from '@mui/material/styles'
import {
	Box,
	Input,
	Portal,
	Divider,
	Backdrop,
	IconButton,
	Typography,
} from '@mui/material'
// hooks
import useResponsive from 'src/hooks/useResponsive'
// components
import Iconify from 'src/components/Iconify'
import Editor from 'src/components/editor'
import { useExecuteOdoo } from 'src/hooks/useOdoo'
import { useSnackbar } from 'notistack'
import { subTypesMessages } from 'src/@types/message'
import { LoadingButton } from '@mui/lab'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
	right: 0,
	bottom: 0,
	zIndex: 1999,
	minHeight: 440,
	outline: 'none',
	display: 'flex',
	position: 'fixed',
	overflow: 'hidden',
	flexDirection: 'column',
	margin: theme.spacing(3),
	boxShadow: theme.customShadows.z20,
	borderRadius: Number(theme.shape.borderRadius) * 2,
	backgroundColor: theme.palette.background.paper,
}))

const InputStyle = styled(Input)(({ theme }) => ({
	padding: theme.spacing(0.5, 3),
	borderBottom: `solid 1px ${theme.palette.divider}`,
}))

// ----------------------------------------------------------------------
/**
 *
 */
type Props = {
  isOpenCompose: boolean
  onCloseCompose: VoidFunction
  recordId: number
  partnerIds: number[]
  email_to: string
  model: string
  MODELS_CLEAN: string[]
}
/**
 * @component MailCompose
 * @description Component for send mail from chatter odoo only models with inherit mail.thread
 * @param {Props} props props component
 * @param {boolean} props.isOpenCompose is open compose mail
 * @param {VoidFunction} props.onCloseCompose close compose mail
 * @param {number} props.recordId id of record odoo for add message
 * @param {number[]} props.partnerIds ids of partners for send mail
 * @param {string} props.email_to email for send mail readonly
 * @param {string} props.model model of record odoo for add message
 * @param {string[]} props.MODELS_CLEAN models for clean cache react-query
 */
export default function MailCompose({
	isOpenCompose,
	onCloseCompose,
	recordId,
	email_to,
	model,
	partnerIds,
	MODELS_CLEAN,
}: Props) {
	const [fullScreen, setFullScreen] = useState(false)

	const [message, setMessage] = useState('')
	const [subject, setSubject] = useState('')

	const isDesktop = useResponsive('up', 'sm')
	const sendMail = useExecuteOdoo(MODELS_CLEAN)
	const [isSending, setIsSending] = useState(false)
	const { enqueueSnackbar } = useSnackbar()
	const handleChangeMessage = (value: string) => {
		setMessage(value)
	}

	const handleExitFullScreen = () => {
		setFullScreen(false)
	}

	const handleEnterFullScreen = () => {
		setFullScreen(true)
	}

	const handleClose = () => {
		onCloseCompose()
		setFullScreen(false)
	}
	const handleSend = async () => {
		setIsSending(true)

		setTimeout(async () => {
			sendMail
				.mutateAsync({
					model,
					method: 'message_post',
					args: [recordId],
					kwargs: {
						body: message,
						subject,
						partner_ids: partnerIds,
						subtype_id: subTypesMessages['mail.mt_comment'],
					},
				})
				.then(() => {
					enqueueSnackbar('Mail sent', { variant: 'success' })
					handleClose()
					setSubject('')
					setMessage('')
					setIsSending(false)
				})
				.catch((error) => {
					enqueueSnackbar(error.message, { variant: 'error' })
					setIsSending(false)
				})
		}, 1000)
	}

	if (!isOpenCompose) {
		return null
	}

	return (
		<Portal>
			<Backdrop open={fullScreen || !isDesktop} sx={{ zIndex: 1998 }} />
			<RootStyle
				sx={{
					...(fullScreen && {
						top: 0,
						left: 0,
						zIndex: 1999,
						margin: 'auto',
						width: {
							xs: 'calc(100% - 24px)',
							md: 'calc(100% - 80px)',
						},
						height: {
							xs: 'calc(100% - 24px)',
							md: 'calc(100% - 80px)',
						},
					}),
				}}
			>
				<Box
					sx={{
						pl: 3,
						pr: 1,
						height: 60,
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<Typography variant="h6">New Message</Typography>
					<Box sx={{ flexGrow: 1 }} />

					<IconButton
						onClick={fullScreen ? handleExitFullScreen : handleEnterFullScreen}
					>
						<Iconify
							icon={fullScreen ? 'eva:collapse-fill' : 'eva:expand-fill'}
							width={20}
							height={20}
						/>
					</IconButton>

					<IconButton onClick={handleClose}>
						<Iconify icon={'eva:close-fill'} width={20} height={20} />
					</IconButton>
				</Box>

				<Divider />

				<InputStyle
					disableUnderline
					placeholder="To"
					defaultValue={email_to}
					disabled={true}
				/>

				<InputStyle
					disableUnderline
					placeholder="Subject"
					onChange={(event) => setSubject(event.target.value)}
				/>

				<Editor
					simple
					id="compose-mail"
					value={message}
					onChange={handleChangeMessage}
					placeholder="Type a message"
					sx={{
						borderColor: 'transparent',
						flexGrow: 1,
					}}
				/>

				<Divider />

				<Box sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center' }}>
					<LoadingButton
						type="submit"
						loading={isSending}
						variant="contained"
						onClick={handleSend}
					>
            Send
					</LoadingButton>
				</Box>
			</RootStyle>
		</Portal>
	)
}
