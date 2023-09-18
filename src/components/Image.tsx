import {
	LazyLoadImage,
	LazyLoadImageProps,
} from 'react-lazy-load-image-component'
// @mui
import { Theme } from '@mui/material/styles'
import { Box, BoxProps, SxProps } from '@mui/material'

// ----------------------------------------------------------------------

export type ImageRatio =
  | '4/3'
  | '3/4'
  | '6/4'
  | '4/6'
  | '16/9'
  | '9/16'
  | '21/9'
  | '9/21'
  | '1/1'

type IProps = BoxProps & LazyLoadImageProps

interface Props extends IProps {
  sx?: SxProps<Theme>
  ratio?: ImageRatio
  disabledEffect?: boolean
}

/**
 * @component Image
 * @description A wrapper for the react-lazy-load-image-component component
 * @param {ImageRatio} ratio - The aspect ratio of the image
 * @param {boolean} disabledEffect - If true, the effect will be disabled
 * @param {string} effect - The effect to use
 * @param {SxProps} sx - Other props to pass to the MUI Box component
 * @param {LazyLoadImageProps} other - Other props to pass to the react-lazy-load-image-component component
 * @example
 * <Image src="https://zone-assets-api.vercel.app/assets/img_placeholder.svg" />
 * <Image src="https://zone-assets-api.vercel.app/assets/img_placeholder.svg" ratio="4/3" />
 * <Image src="https://zone-assets-api.vercel.app/assets/img_placeholder.svg" ratio="4/3" effect="opacity" />
 * <Image src="https://zone-assets-api.vercel.app/assets/img_placeholder.svg" ratio="4/3" disabledEffect />
 * <Image src="https://zone-assets-api.vercel.app/assets/img_placeholder.svg" ratio="4/3" disabledEffect effect="opacity" />
 * <Image src="https://zone-assets-api.vercel.app/assets/img_placeholder.svg" ratio="4/3" disabledEffect effect="opacity" sx={{ borderRadius: 1 }} />
 */
export default function Image({
	ratio,
	disabledEffect = false,
	effect = 'blur',
	sx,
	...other
}: Props) {
	if (ratio) {
		return (
			<Box
				component="span"
				sx={{
					width: 1,
					lineHeight: 0,
					display: 'block',
					overflow: 'hidden',
					position: 'relative',
					pt: getRatio(ratio),
					'& .wrapper': {
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						lineHeight: 0,
						position: 'absolute',
						backgroundSize: 'cover !important',
					},
					...sx,
				}}
			>
				<Box
					component={LazyLoadImage}
					wrapperClassName="wrapper"
					effect={disabledEffect ? undefined : effect}
					placeholderSrc="https://zone-assets-api.vercel.app/assets/img_placeholder.svg"
					sx={{ width: 1, height: 1, objectFit: 'cover' }}
					{...other}
				/>
			</Box>
		)
	}

	return (
		<Box
			component="span"
			sx={{
				lineHeight: 0,
				display: 'block',
				overflow: 'hidden',
				'& .wrapper': {
					width: 1,
					height: 1,
					backgroundSize: 'cover !important',
				},
				...sx,
			}}
		>
			<Box
				component={LazyLoadImage}
				wrapperClassName="wrapper"
				effect={disabledEffect ? undefined : effect}
				placeholderSrc="https://zone-assets-api.vercel.app/assets/img_placeholder.svg"
				sx={{ width: 1, height: 1, objectFit: 'cover' }}
				{...other}
			/>
		</Box>
	)
}

// ----------------------------------------------------------------------

function getRatio(ratio = '1/1') {
	return {
		'4/3': 'calc(100% / 4 * 3)',
		'3/4': 'calc(100% / 3 * 4)',
		'6/4': 'calc(100% / 6 * 4)',
		'4/6': 'calc(100% / 4 * 6)',
		'16/9': 'calc(100% / 16 * 9)',
		'9/16': 'calc(100% / 9 * 16)',
		'21/9': 'calc(100% / 21 * 9)',
		'9/21': 'calc(100% / 9 * 21)',
		'1/1': '100%',
	}[ratio]
}
