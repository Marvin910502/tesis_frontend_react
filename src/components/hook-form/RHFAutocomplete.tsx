import {
  Autocomplete,
  AutocompleteProps,
  TextField,
  TextFieldProps
} from '@mui/material'
import { Controller, useFormContext } from 'react-hook-form'
import Language from 'src/@types/language'
import { Many2One } from 'src/@types/relational_fileds'

interface IProps
  extends Omit<
    AutocompleteProps<Many2One | Language | string, any, any, any>,
    'renderInput'
  > {
  name: string
}

export default function RHFAutocomplete<T> ({
  name,
  ...other
}: IProps & TextFieldProps) {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        return (
          <Autocomplete
            {...other}
            value={value}
            isOptionEqualToValue={(option, value) => {
              if (typeof option === 'string' && typeof value === 'string') {
                return option === value
              }
              return (option as Many2One | Language)?.id === (value as Many2One | Language)?.id
            }}
            onChange={(event, value) => onChange(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                error={!!error}
                helperText={error?.message}
                {...other}
              />
            )}
          />
        )
      }}
    />
  )
}
