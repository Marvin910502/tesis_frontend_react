import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { TextField, Autocomplete, TextFieldProps, AutocompleteProps, Chip } from '@mui/material'

import { Many2One } from 'src/@types/relational_fileds'

interface IProps extends Omit<AutocompleteProps<Many2One, any, any, any>, 'renderInput'> {
  name: string
}

export default function RHFAutocompleteMulti<T> ({
  name,
  ...other
}: IProps&TextFieldProps) {
  const { control } = useFormContext()
  return (
    <Controller control={control} name={name}
                render={({
                  field: {
                    value,
                    onChange
                  },
                  fieldState: { error }
                }) => {
                  return value
                    ? (<Autocomplete
                      {...other}
                      defaultValue={value}
                      value={value}
                      multiple
                      freeSolo
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(event, value) => onChange(value)}
                      renderTags={(value: Many2One[], getTagProps) =>
                        value.filter((val) => val.id > 0).map((option, index) => (
                          <Chip variant="outlined" label={option.name} {...getTagProps({ index })} key={option.id}/>
                        ))
                      }
                      renderInput={(params) => (
                        <TextField {...params} error={!!error} helperText={error?.message} {...other} />)}
                    />)
                    : <></>
                }}
    />
  )
}
