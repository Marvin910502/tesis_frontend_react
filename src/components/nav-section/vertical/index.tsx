// @mui
import { styled } from '@mui/material/styles'
import { List, Box, ListSubheader } from '@mui/material'
// type
import { NavSectionProps } from '../type'
//
import { NavListRoot } from './NavList'
import { ListSubheaderProps } from '@mui/material/ListSubheader/ListSubheader'

// ----------------------------------------------------------------------

export const ListSubheaderStyle = styled((props: ListSubheaderProps) => (
	<ListSubheader disableSticky disableGutters {...props}>
		{props.children}
	</ListSubheader>
))(({ theme }) => ({
	...theme.typography.overline,
	paddingTop: theme.spacing(3),
	paddingLeft: theme.spacing(2),
	paddingBottom: theme.spacing(1),
	color: theme.palette.text.primary,
	transition: theme.transitions.create('opacity', {
		duration: theme.transitions.duration.shorter,
	}),
}))

// ----------------------------------------------------------------------
/**
 * @param {NavSectionProps} props
 * @param {NavSectionProps.navConfig} props.navConfig array of object with subheader and items
 * @param {NavSectionProps.isCollapse} props.isCollapse boolean to check if the nav is collapsed
 * @param {NavSectionProps.other} props.other other props to pass to the Box component
 * @returns {JSX.Element}
 * @description
 * NavSectionVertical is a component that renders a vertical navigation section
 * @example
 * <NavSectionVertical navConfig={navConfig} isCollapse={isCollapse} />
 */
export default function NavSectionVertical({
	navConfig,
	isCollapse = false,
	...other
}: NavSectionProps): JSX.Element {
	return (
		<Box {...other}>
			{navConfig.map((group) => (
				<List key={group.subheader} disablePadding sx={{ px: 2 }}>
					<ListSubheaderStyle
						sx={{
							...(isCollapse && {
								opacity: 0,
							}),
						}}
					>
						{group.subheader}
					</ListSubheaderStyle>

					{group.items.map((list) => (
						<NavListRoot key={list.title} list={list} isCollapse={isCollapse} />
					))}
				</List>
			))}
		</Box>
	)
}
