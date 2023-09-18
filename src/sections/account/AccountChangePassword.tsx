import * as Yup from 'yup'
import { useSnackbar } from 'notistack'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
// @mui
import { Stack, Card, InputAdornment, IconButton } from '@mui/material'
import { LoadingButton } from '@mui/lab'
// components
import { FormProvider, RHFTextField } from 'src/components/hook-form'
import useLocales from 'src/hooks/useLocales'
import { useUpdateOdoo } from 'src/hooks/useOdoo'
import useAuth from 'src/hooks/useAuth'
import Iconify from 'src/components/Iconify'
import { useState } from 'react'

// ----------------------------------------------------------------------

type FormValuesProps = {
  newPassword: string;
  confirmNewPassword: string;
};

export default function AccountChangePassword () {
  const { translate } = useLocales()
  const { enqueueSnackbar } = useSnackbar()

  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .min(4, translate('account.error.min_password', { defaultValue: 'Password must be at least 6 characters' }))
      .required(translate('account.error.new_password', { defaultValue: 'New Password is required' })),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], translate('account.error.match_password', { defaultValue: 'Passwords must match' }))
  })

  const defaultValues = {
    newPassword: '',
    confirmNewPassword: ''
  }

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues
  })

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting }
  } = methods

  const updateUser = useUpdateOdoo()
  const { user, logout } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const onSubmit = async (data: FormValuesProps) => {
    updateUser.mutateAsync({
      model: 'res.users',
      id: user?.uid,
      data: {
        password: data.newPassword
      }

    }).then(() => {
      enqueueSnackbar(translate('account.success.change_password', { defaultValue: 'Change password successfully' }), { variant: 'success' })
      reset()
      logout()
    }).catch((error) => {
      enqueueSnackbar(error.message, { variant: 'error' })
    })
  }

  return (
    <Card sx={{ p: 3 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} alignItems="flex-end">

          <RHFTextField name="newPassword" type={showPassword ? 'text' : 'password'}
                        label={translate('account.new_password', { defaultValue: 'New Password' })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
          />

          <RHFTextField name="confirmNewPassword" type={showPassword ? 'text' : 'password'}
                        label={translate('account.confirm_password', { defaultValue: 'Confirm New Password' })}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}/>
                              </IconButton>
                            </InputAdornment>
                          )
                        }}

          />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {translate('buttons.save', { defaultValue: 'Save Changes' })}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Card>
  )
}
