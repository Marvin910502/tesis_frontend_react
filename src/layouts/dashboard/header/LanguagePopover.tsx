import { useState } from 'react'
// @mui
import { MenuItem, Stack } from '@mui/material'
// components
import Image from '../../../components/Image'
import MenuPopover from '../../../components/MenuPopover'
import { IconButtonAnimate } from '../../../components/animate'
import useLocales from 'src/hooks/useLocales'

// ----------------------------------------------------------------------

// const LANGS = [
//   {
//     label: 'English',
//     value: 'en',
//     icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_en.svg'
//   },
//   {
//     label: 'German',
//     value: 'de',
//     icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_de.svg'
//   },
//   {
//     label: 'French',
//     value: 'fr',
//     icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_fr.svg'
//   }
// ]

// ----------------------------------------------------------------------

export default function LanguagePopover() {
	const { allLang, currentLang, onChangeLang } = useLocales()
	const [open, setOpen] = useState<HTMLElement | null>(null)

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setOpen(event.currentTarget)
	}

	const handleClose = () => {
		setOpen(null)
	}

	return (
		<>
			<IconButtonAnimate
				onClick={handleOpen}
				sx={{
					width: 40,
					height: 40,
					...(open && { bgcolor: 'action.selected' }),
				}}
			>
				<Image disabledEffect src={currentLang.icon} alt={currentLang.label} />
			</IconButtonAnimate>

			<MenuPopover
				open={Boolean(open)}
				anchorEl={open}
				onClose={handleClose}
				sx={{
					mt: 1.5,
					ml: 0.75,
					width: 180,
					'& .MuiMenuItem-root': {
						px: 1,
						typography: 'body2',
						borderRadius: 0.75,
					},
				}}
			>
				<Stack spacing={0.75}>
					{allLang.map((option) => (
						<MenuItem
							key={option.value}
							selected={option.value === currentLang.value}
							onClick={() => {
								onChangeLang(option.value)
								handleClose()
							}}
						>
							<Image
								disabledEffect
								alt={option.label}
								src={option.icon}
								sx={{ width: 28, mr: 2 }}
							/>

							{option.label}
						</MenuItem>
					))}
				</Stack>
			</MenuPopover>
		</>
	)
}
