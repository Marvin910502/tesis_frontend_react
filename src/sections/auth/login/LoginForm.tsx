import * as Yup from 'yup'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
// form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// routes
import { PATH_AUTH } from 'src/routes/paths'
// hooks
import useAuth from '../../../hooks/useAuth'
// import useIsMountedRef from 'src/hooks/useIsMountedRef'
// components
import Iconify from 'src/components/Iconify'
import {
	FormProvider,
	RHFTextField,
	RHFCheckbox,
} from 'src/components/hook-form'
import { useSnackbar } from 'notistack'
import useLocales from 'src/hooks/useLocales'

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string
  password: string
  remember: boolean
  afterSubmit?: string
}

export default function LoginForm() {
	const { login } = useAuth()
	const { enqueueSnackbar } = useSnackbar()
	const { translate } = useLocales()
	// const isMountedRef = useIsMountedRef()

	const [showPassword, setShowPassword] = useState(false)

	const LoginSchema = Yup.object().shape({
		email: Yup.string().required('Email is required'),
		password: Yup.string().required('Password is required'),
	})

	const defaultValues = {
		email: 'admin',
		password: 'admin',
		remember: true,
	}

	const methods = useForm<FormValuesProps>({
		resolver: yupResolver(LoginSchema),
		defaultValues,
	})

	const {
		setError,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = methods

	const onSubmit = async (data: FormValuesProps) => {
		try {
			await login(data.email, data.password)
			enqueueSnackbar(translate('login.welcome'), { variant: 'success' })
		} catch (error) {
			setError('afterSubmit', {
				type: 'manual',
				message: error instanceof Error && error?.message ? error.message : '',
			})
			enqueueSnackbar(
				error instanceof Error && error?.message ? error.message : '',
				{ variant: 'error' }
			)
		}
	}

	return (
		<FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
			<Stack spacing={3}>
				{!!errors.afterSubmit && (
					<Alert severity="error">{errors.afterSubmit.message}</Alert>
				)}

				<RHFTextField name="email" label="Email address" />

				<RHFTextField
					name="password"
					label="Password"
					type={showPassword ? 'text' : 'password'}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => setShowPassword(!showPassword)}
									edge="end"
								>
									<Iconify
										icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
									/>
								</IconButton>
							</InputAdornment>
						),
					}}
				/>
			</Stack>

			<Stack
				direction="row"
				alignItems="center"
				justifyContent="space-between"
				sx={{ my: 2 }}
			>
				<RHFCheckbox name="remember" label="Remember me" />
				<Link
					component={RouterLink}
					variant="subtitle2"
					to={PATH_AUTH.resetPassword}
				>
          Forgot password?
				</Link>
			</Stack>

			<LoadingButton
				fullWidth
				size="large"
				type="submit"
				variant="contained"
				loading={isSubmitting}
			>
        Login
			</LoadingButton>
		</FormProvider>
	)
}
