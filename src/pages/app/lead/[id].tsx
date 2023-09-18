import * as React from 'react'
import useSettings from 'src/hooks/useSettings'
import useLocales from 'src/hooks/useLocales'
import { useNavigate, useParams } from 'react-router-dom'
import {
	useCreateOdoo,
	useDeleteOdoo,
	useReadOdoo,
	useSearchOdoo,
	useUpdateOdoo,
} from 'src/hooks/useOdoo'

import { Lead } from 'src/@types/lead'
import { useSnackbar } from 'notistack'
import { ReactNode, useEffect, useMemo } from 'react'
import {
	Alert,
	Button,
	Container,
	Grid,
	ListItem,
	ListItemText,
	Stack,
} from '@mui/material'
import * as Yup from 'yup'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import useToggle from 'src/hooks/useToggle'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import { LoadingButton } from '@mui/lab'
import ChatterHistory from 'src/components/chatter/ChatterHistory'
import { MailActivity } from 'src/@types/message'
import { TasksList } from 'src/components/chatter/Tasks'
import { Attachment } from 'src/@types/attachment'
import { AttachmentsList } from 'src/components/chatter/Attachments'
import MailCompose from 'src/components/chatter/MailCompose'

interface FormValuesProps extends Lead {
  afterSubmit?: string
}

export default function LeadId() {
	const { themeStretch } = useSettings()
	const { translate } = useLocales()
	const { id } = useParams()
	const { data, isLoading } = useReadOdoo<Lead>(
		{
			model: 'crm.lead',
			query: ['id', 'name', 'email_from', 'city', 'type'],
			id: parseInt(id ?? '0'),
		},
		`crm.lead'.${id}`
	)

	const { data: messageIds, isLoading: isLoadingMessages } = useSearchOdoo<{
    id: number
  }>(
  	{
  		model: 'mail.message',
  		query: ['id'],
  		filter: [
  			['model', '=', 'crm.lead'],
  			['res_id', '=', parseInt(id ?? '0')],
  		],
  	},
  	`crm.lead'.${id}.mail.message`
  )
	const { data: activityIds, isLoading: isLoadingActivities } =
    useSearchOdoo<MailActivity>(
    	{
    		model: 'mail.activity',
    		query: [
    			'id',
    			'user_id',
    			'summary',
    			'activity_decoration',
    			'date_deadline',
    			'activity_type_id',
    			'icon',
    		],
    		filter: [
    			['res_model_id.model', '=', 'crm.lead'],
    			['res_id', '=', parseInt(id ?? '0')],
    		],
    	},
    	`crm.lead'.${id}.mail.activity`
    )
	const { data: attachments, isLoading: isLoadingAttachments } =
    useSearchOdoo<Attachment>(
    	{
    		model: 'ir.attachment',
    		query: [
    			'id',
    			'datas',
    			'mimetype',
    			'res_id',
    			'res_model',
    			'local_url',
    			'name',
    		],
    		filter: [
    			['res_model', '=', 'crm.lead'],
    			['res_id', '=', parseInt(id ?? '0')],
    		],
    	},
    	`crm.lead'.${id}.ir.attachment`
    )
	const updateLead = useUpdateOdoo([`crm.lead.${id ?? '0'}`])
	const deleteLead = useDeleteOdoo(['crm.lead'])
	const createLead = useCreateOdoo(['crm.lead'])
	const handelCreate = () => {
		reset({ id: 0, name: '', email_from: '', type: 'lead' })
		onOpen()
	}
	const handelDelete = () => {
		deleteLead
			.mutateAsync({
				model: 'crm.lead',
				id: parseInt(id ?? '0'),
			})
			.then(() => enqueueSnackbar('Delete', { variant: 'success' }))
			.catch((reason) => {
				console.error(reason)
				reset()
				setError('afterSubmit', {
					type: 'manual',
					message: reason,
				})
				enqueueSnackbar(reason, { variant: 'error' })
			})
		navigate('/app/crm/')
	}
	const options: ReactNode = (
		<>
			<ListItem alignItems={'center'} onClick={() => handelCreate()} divider>
				<ListItemText
					sx={{ textAlign: 'center' }}
					primary={translate('buttons.create')}
				/>
			</ListItem>
			<ListItem alignItems={'center'} onClick={() => handelDelete()} divider>
				<ListItemText
					sx={{ textAlign: 'center' }}
					primary={translate('buttons.delete')}
				/>
			</ListItem>
		</>
	)
	const partnerScheme = Yup.object().shape({
		name: Yup.string().required(
			translate('partner.form.error.name is required', {
				defaultValue: 'name is required',
			})
		),
		email_from: Yup.string().email('error').required(),
	})
	const defaultValues = useMemo<Lead>(() => {
		return data
			? { ...data }
			: { id: 0, name: '', email_from: '', type: 'lead' }
	}, [data])
	const methods = useForm<FormValuesProps>({
		resolver: yupResolver(partnerScheme),
		defaultValues: useMemo(() => defaultValues, [defaultValues]),
	})
	const { toggle, onOpen, onClose } = useToggle()
	const {
		toggle: emailToggle,
		onOpen: onOpenEmailToggle,
		onClose: onCloseEmailToggle,
	} = useToggle()
	const {
		reset,
		setError,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods
	useEffect(() => {
		reset(defaultValues)
	}, [data])

	const actions = (
		<>
			{!toggle ? (
				<Button
					variant="contained"
					startIcon={
						<Iconify icon={'akar-icons:edit'} width={20} height={20} />
					}
					onClick={onOpen}
				>
					{translate('button.edit', { defaultValue: 'edit' })}
				</Button>
			) : null}
			<Button
				sx={{ mx: 1 }}
				variant="contained"
				startIcon={
					<Iconify icon={'mdi:email-open-outline'} width={20} height={20} />
				}
				onClick={onOpenEmailToggle}
			>
        Send
			</Button>
		</>
	)
	const navigate = useNavigate()
	const { enqueueSnackbar } = useSnackbar()
	const onSubmit = (formData: FormValuesProps) => {
		if (formData.id > 0) {
			updateLead
				.mutateAsync({
					model: 'crm.lead',
					id: formData.id,
					data: {
						...formData,
					},
				})
				.then(() => {
					enqueueSnackbar('Updated', { variant: 'success' })

					onClose()
				})
				.catch((reason) => {
					console.error(reason)
					reset()
					setError('afterSubmit', {
						type: 'manual',
						message: reason,
					})
					enqueueSnackbar(reason, { variant: 'error' })
				})
		} else {
			createLead
				.mutateAsync({
					model: 'crm.lead',
					data: { ...formData },
				})
				.then((result) => {
					enqueueSnackbar('Created', { variant: 'success' })
					navigate(`/app/crm/${result}`)
					onClose()
				})
		}
	}
	return (
		<Page title={'Lead'} action={options}>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<HeaderBreadcrumbs
					heading={data?.name as string}
					links={[
						{ href: '/app/crm', name: 'Clientes' },
						{ href: `/app/crm/${id}`, name: data?.name as string },
					]}
					action={actions}
				/>

				<Stack spacing={3}>
					{(!isLoading && data) || id === 'new' ? (
						<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
							{!!errors.afterSubmit && (
								<Alert severity="error">{errors.afterSubmit.message}</Alert>
							)}

							<Grid spacing={3} container>
								<Grid item xs={12} sm={6} md={4} key={'name'}>
									<RHFTextField name="name" label="Name" disabled={!toggle} />
								</Grid>
								<Grid item xs={12} sm={6} md={4} key={'email'}>
									<RHFTextField
										name="email_from"
										label="email"
										disabled={!toggle}
									/>
								</Grid>
								{/* <Grid item xs={12} sm={6} md={4} key={'country_id'}> */}

								{/* {(countries && countries.data) ? (<RHFAutocomplete name="country_id" options={countries.data.records ?? []} */}
								{/*                 getOptionLabel={(option) => (option as Many2One)?.name || ''} label="Country" */}
								{/*                 disabled={!toggle} fullWidth={true} autoHighlight):null */}

								{/* />} */}

								{/* </Grid> */}
								{toggle ? (
									<Grid item xs={12}>
										<LoadingButton
											type={'submit'}
											variant={'contained'}
											loading={isSubmitting}
										>
											{translate('button.save', { defaultValue: 'save' })}
										</LoadingButton>
									</Grid>
								) : null}
							</Grid>
						</FormProvider>
					) : null}
				</Stack>
				{!isLoadingAttachments ? (
					<AttachmentsList
						attachments={attachments?.records || []}
						id={parseInt(id ?? '0')}
						model={'crm.lead'}
						invalidateQuery={[`crm.lead'.${id}.ir.attachment`]}
					/>
				) : null}
				{activityIds && activityIds?.records.length && !isLoadingActivities ? (
					<TasksList
						tasks={activityIds.records}
						invalidateQuerys={[
							`crm.lead'.${id}.mail.activity`,
							`crm.lead'.${id}.mail.message`,
						]}
					/>
				) : null}
				{messageIds && messageIds?.records.length && !isLoadingMessages ? (
					<ChatterHistory ids={messageIds.records.map((value) => value.id)} />
				) : null}
				<MailCompose
					isOpenCompose={emailToggle}
					onCloseCompose={onCloseEmailToggle}
					recordId={parseInt(id ?? '0')}
					partnerIds={[2, 3]}
					email_to={'aasd@asdas.es'}
					model={'crm.lead'}
					MODELS_CLEAN={[`crm.lead'.${id}.mail.message`]}
				/>
			</Container>
		</Page>
	)
}
