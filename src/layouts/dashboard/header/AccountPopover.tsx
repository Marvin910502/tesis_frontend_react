import { useState } from 'react'
// @mui
import { alpha } from '@mui/material/styles'
import { Box, Divider, Typography, Stack, MenuItem, Avatar } from '@mui/material'
// components
import MenuPopover from '../../../components/MenuPopover'
import { IconButtonAnimate } from '../../../components/animate'
import useAuth from 'src/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import useLocales from 'src/hooks/useLocales'
import { getAvatar } from 'src/@types/user'

export default function AccountPopover () {
  const [open, setOpen] = useState<HTMLElement | null>(null)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { translate } = useLocales()
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }

  const handleClose = (linkTo:string) => {
    navigate(linkTo)
    setOpen(null)
  }

  const MENU_OPTIONS = [
    {
      label: translate('mmenu.home', { defaultValue: 'Home' }),
      linkTo: '/app'
    },
    // {
    //   label: 'Profile',
    //   linkTo: '/'
    // },
    {
      label: translate('mmenu.settings', { defaultValue: 'Settings' }),
      linkTo: '/app/user'
    }
  ]

  return (
    <>
      <IconButtonAnimate
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8)
            }
          })
        }}
      >
        <Avatar
          src={user ? getAvatar(user.uid) : ''}
          alt={user?.name}
        />
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          '& .MuiMenuItem-root': {
            typography: 'body2',
            borderRadius: 0.75
          }
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user?.username}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClose(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ m: 1 }} onClick={logout}>{translate('mmenu.logout', { defaultValue: 'Logout' })}</MenuItem>
      </MenuPopover>
    </>
  )
}
