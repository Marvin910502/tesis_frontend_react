import useLocales from 'src/hooks/useLocales'
import { useSnackbar } from 'notistack'
import { ContextUser } from 'src/@types/user'
import useAuth from 'src/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { useUpdateOdoo } from 'src/hooks/useOdoo'
import { Alert, Stack } from '@mui/material'
import { FormProvider, RHFSelect } from 'src/components/hook-form'
import { LoadingButton } from '@mui/lab'
type FormValuesProps = ContextUser&{
  afterSubmit?: string
}
export default function AccountPreferences () {
  const { translate } = useLocales()
  const { enqueueSnackbar } = useSnackbar()
  const { user } = useAuth()
  const defaultValues = user?.user_context || {}

  const methods = useForm<FormValuesProps>({
    defaultValues
  })
  const {
    setError,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = methods
  const updateUser = useUpdateOdoo()
  const onSubmit = async (data: FormValuesProps) => {
    updateUser.mutateAsync(
      {
        model: 'res.users',
        id: user?.uid,
        data: {
          lang: data.lang,
          tz: data.tz
        }
      }).then(() => {
      enqueueSnackbar(translate('account.success.update_user', { defaultValue: 'Update user successfully' }), { variant: 'success' })
    }).catch((error) => {
      setError('afterSubmit', { message: error.message })
      enqueueSnackbar(`Update issue! ${error.message} `, { variant: 'error' })
    })
  }
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>

      <Stack spacing={3} alignItems="flex-end">
    {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
    <RHFSelect key="lang" name="lang" label={translate('account.lang', { defaultValue: 'Language' })} >
      <option value="en_US">English</option>
      <option value="es_ES">Spanish</option>
    </RHFSelect>
    <RHFSelect key="tz" name="tz" label={translate('account.tz', { defaultValue: 'Timezone' })} >
      <option value="Europe/Rome">Europe/Rome</option>
      <option value="Europe/Madrid">Europe/Madrid</option>
      <option value="Europe/Paris">Europe/Paris</option>
      <option value="Europe/London">Europe/London</option>
      <option value="Europe/Berlin">Europe/Berlin</option>
      <option value="Europe/Amsterdam">Europe/Amsterdam</option>
    </RHFSelect>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {translate('buttons.save', { defaultValue: 'Save Changes' })}
        </LoadingButton>
  </Stack>

    </FormProvider>
  )
}
