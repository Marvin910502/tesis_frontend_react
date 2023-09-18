// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { TextField } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { DateInputProps } from '@mui/x-date-pickers/internals/components/PureDateInput'

//

// ----------------------------------------------------------------------
interface Props extends Partial<DateInputProps>{
  name: string;
}

export default function RHFDateTimePicker ({ name, ...other }: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name="end"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          {...field}
          {...other}
          renderInput={(params) => (
            <TextField
              {...params}
              error={!!error}
              fullWidth
              helperText={error && 'End date must be later than start date'}
            />
          )}

        />
      )}
    />
  )
}
