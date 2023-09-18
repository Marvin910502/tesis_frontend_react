import Page from 'src/components/Page'
import { useNavigate, useParams } from 'react-router-dom'
import {
	useCreateOdoo,
	useDeleteOdoo,
	useReadOdoo,
	useUpdateOdoo,
} from 'src/hooks/useOdoo'
import { Partner } from 'src/@types/partner'
import {
	Alert,
	Button,
	Container,
	Grid,
	ListItem,
	ListItemText,
	Stack,
} from '@mui/material'
import useSettings from 'src/hooks/useSettings'
import { ReactNode, useEffect, useMemo } from 'react'
import useLocales from 'src/hooks/useLocales'
import { useSnackbar } from 'notistack'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup/dist/yup'
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import useToggle from 'src/hooks/useToggle'
import Iconify from 'src/components/Iconify'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import { LoadingButton } from '@mui/lab'

interface FormValuesProps extends Partner {
  afterSubmit?: string
}

export default function PartnerId() {
	const { themeStretch } = useSettings()
	const { translate } = useLocales()
	const { id } = useParams()
	const { data, isLoading } = useReadOdoo<Partner>(
		{
			model: 'res.partner',
			query: ['id', 'name', 'email', 'city', 'country_id'],
			id: parseInt(id ?? '0'),
		},
		`res.partner.${id}`
	)

	const updatePartner = useUpdateOdoo([`res.partner.${id ?? '0'}`])
	const deletePartner = useDeleteOdoo(['res.partner'])
	const createPartner = useCreateOdoo(['res.partner'])
	const navigate = useNavigate()
	const { enqueueSnackbar } = useSnackbar()

	const handelCreate = () => {
		reset({ id: 0, name: '', email: '' })
		onOpen()
	}
	const handelDelete = () => {
		deletePartner
			.mutateAsync({
				model: 'res.partner',
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
		navigate('/app/customer/')
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
		email: Yup.string().email('error').required(),
	})
	const defaultValues = useMemo<Partner>(() => {
		return data ? { ...data } : { id: 0, name: '', email: '' }
	}, [data])

	const methods = useForm<FormValuesProps>({
		resolver: yupResolver(partnerScheme),
		defaultValues: useMemo(() => defaultValues, [defaultValues]),
	})
	const { toggle, onOpen, onClose } = useToggle()
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
		</>
	)
	const onSubmit = (formData: FormValuesProps) => {
		if (formData.id > 0) {
			updatePartner
				.mutateAsync({
					model: 'res.partner',
					id: formData.id,
					data: {
						...formData,
						// country_id: formData?.country_id?.id ?? false
					},
				})
				.then(() => {
					enqueueSnackbar('Updeted', { variant: 'success' })

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
			createPartner
				.mutateAsync({
					model: 'res.partner',
					data: { ...formData, customer_rank: 1 },
				})
				.then((result) => {
					enqueueSnackbar('Updeted', { variant: 'success' })
					navigate(`/app/customer/${result}`)
					onClose()
				})
		}
	}
	return (
		<Page title={'Partner'} action={options}>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<HeaderBreadcrumbs
					heading={data?.name as string}
					links={[
						{ href: '/app/customer', name: 'Clientes' },
						{ href: `/app/customer/${id}`, name: data?.name as string },
					]}
					action={actions}
				/>

				<Stack spacing={3}>
					{!isLoading && data ? (
						<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
							{!!errors.afterSubmit && (
								<Alert severity="error">{errors.afterSubmit.message}</Alert>
							)}
							<Grid spacing={3} container>
								<Grid item xs={12} sm={6} md={4} key={'name'}>
									<RHFTextField name="name" label="Name" disabled={!toggle} />
								</Grid>
								<Grid item xs={12} sm={6} md={4} key={'email'}>
									<RHFTextField name="email" label="email" disabled={!toggle} />
								</Grid>
								<Grid item xs={12} sm={6} md={4} key={'country_id'}>
									{/* {(countries && countries.data) ? (<RHFAutocomplete name="country_id" options={countries.data.records ?? []} */}
									{/*                 getOptionLabel={(option) => (option as Many2One)?.name || ''} label="Country" */}
									{/*                 disabled={!toggle} fullWidth={true} autoHighlight):null */}

									{/* />} */}
								</Grid>
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
			</Container>
		</Page>
	)
}
