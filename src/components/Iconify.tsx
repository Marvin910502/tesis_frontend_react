// icons
import { Icon, IconifyIcon } from '@iconify/react'
// @mui
import { Box, BoxProps, SxProps } from '@mui/material'

// ----------------------------------------------------------------------

interface Props extends BoxProps {
  sx?: SxProps
  icon: IconifyIcon | string
}

/**
 * @component Iconify
 * @description A wrapper for the Iconify Icon component
 * @param {IconifyIcon | string} icon - The icon to display (either an IconifyIcon or a string)
 * @param {SxProps} sx - Other props to pass to the MUI Box component
 * @param {BoxProps} other - Other props to pass to the MUI Box component
 * @example <Iconify icon="mdi:home" />
 * @see https://iconify.design/icon-sets
 */
export default function Iconify({ icon, sx, ...other }: Props) {
	return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />
}
