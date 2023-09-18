import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { Box, Grid, Card, Stack, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// hooks
import useAuth from 'src//hooks/useAuth'
// utils
import { fData } from 'src/utils/formatNumber'
// _mock
// import { countries } from 'src/_mock'
// components
import {
	FormProvider,
	// RHFSwitch,
	// RHFSelect,
	RHFTextField,
	RHFUploadAvatar,
} from 'src/components/hook-form'
import { useUpdateOdoo } from 'src/hooks/useOdoo'
import useLocales from 'src/hooks/useLocales'
import { getAvatar } from 'src/@types/user'

// ----------------------------------------------------------------------

type FormValuesProps = {
  name: string
  username: string
  avatar: File | string
}

/**
 * AccountPopover is a component that displays a popover menu with options for the user's account.
 */

export default function AccountGeneral() {
	const { translate } = useLocales()
	const { enqueueSnackbar } = useSnackbar()

	const { user, logout } = useAuth()

	const UpdateUserSchema = Yup.object().shape({
		name: Yup.string().required(
			translate('account.error.name_is_required', {
				defaultValue: 'Name is required',
			})
		),
	})
	const updateUser = useUpdateOdoo()
	const defaultValues = {
		name: user?.name || '',
		username: user?.username || '',
		avatar: user ? getAvatar(user.uid) : '',
	}

	const methods = useForm<FormValuesProps>({
		resolver: yupResolver(UpdateUserSchema),
		defaultValues,
	})

	const {
		watch,
		setValue,
		handleSubmit,
		formState: { isSubmitting },
	} = methods

	console.log('values', watch())

	const onSubmit = async (data: FormValuesProps) => {
		const fileReader = new FileReader()
		if (data.avatar instanceof File) {
			fileReader.readAsDataURL(data.avatar)
			fileReader.onload = () => {
				const avatar = (fileReader.result as string).split(',')[1]
				updateUser
					.mutateAsync({
						model: 'res.users',
						data: {
							image_1920: avatar,
							name: data.name,
							email: data.username,
							login: data.username,
						},
						id: user?.uid || 0,
					})
					.then(() => {
						enqueueSnackbar(
							translate('account.updated', { defaultValue: 'Update success!' })
						)
						logout()
					})
					.catch((error) => {
						enqueueSnackbar(`Update issue! ${error.message} `, {
							variant: 'error',
						})
					})
			}
		} else {
			updateUser
				.mutateAsync({
					model: 'res.users',
					data: {
						name: data.name,
						email: data.username,
						login: data.username,
					},
					id: user?.uid || 0,
				})
				.then(() => {
					enqueueSnackbar(
						translate('account.updated', { defaultValue: 'Update success!' })
					)
					logout()
				})
				.catch((error) => {
					console.error(error)
				})
		}
	}

	const handleDrop = useCallback(
		(acceptedFiles: File[]) => {
			const file = acceptedFiles[0]

			if (file) {
				setValue(
					'avatar',
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			}
		},
		[setValue]
	)

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Grid container spacing={3}>
				<Grid item xs={12} md={4}>
					<Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
						<RHFUploadAvatar
							name="avatar"
							accept={{ image: ['*'] }}
							maxSize={3145728}
							onDrop={handleDrop}
							helperText={
								<Typography
									variant="caption"
									sx={{
										mt: 2,
										mx: 'auto',
										display: 'block',
										textAlign: 'center',
										color: 'text.secondary',
									}}
								>
									{translate('account.format_image', {
										defaultValue: 'Allowed *.jpeg, *.jpg, *.png, *.gif',
									})}
									<br />{' '}
									{translate('account.size_image', {
										defaultValue: 'max size of',
									})}{' '}
									{fData(3145728)}
								</Typography>
							}
						/>

						{/* <RHFSwitch */}
						{/*   name="isPublic" */}
						{/*   labelPlacement="start" */}
						{/*   label="Public Profile" */}
						{/*   sx={{ mt: 5 }} */}
						{/* /> */}
					</Card>
				</Grid>

				<Grid item xs={12} md={8}>
					<Card sx={{ p: 3 }}>
						<Box
							sx={{
								display: 'grid',
								rowGap: 3,
								columnGap: 2,
								gridTemplateColumns: {
									xs: 'repeat(1, 1fr)',
									sm: 'repeat(2, 1fr)',
								},
							}}
						>
							<RHFTextField
								name="name"
								label={translate('account.name', { defaultValue: 'Name' })}
							/>
							<RHFTextField
								name="username"
								label={translate('account.email', {
									defaultValue: 'Email Address',
								})}
							/>
						</Box>

						<Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
							{/* <RHFTextField name="about" multiline rows={4} label="About" /> */}

							<LoadingButton
								type="submit"
								variant="contained"
								loading={isSubmitting}
							>
								{translate('buttons.save', { defaultValue: 'Save Changes' })}
							</LoadingButton>
						</Stack>
					</Card>
				</Grid>
			</Grid>
		</FormProvider>
	)
}
