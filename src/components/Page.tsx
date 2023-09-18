import { Helmet } from 'react-helmet-async'
import { forwardRef, ReactNode } from 'react'
// @mui
import { Box, BoxProps, Fab } from '@mui/material'
import Iconify from 'src/components/Iconify'
import useToggle from 'src/hooks/useToggle'
import { OptionsDrawer } from 'src/components/OptionsDrawer'
import { ListProps } from '@mui/material/List'
// ----------------------------------------------------------------------

interface Props extends BoxProps {
  children: ReactNode
  meta?: ReactNode
  title: string
  action?: ListProps['children']
}

/**
 * @component Page
 * @description A page is a React component that represents a screen or a page in your app.
 * @param {Props} params
 * @param {ReactNode} params.children - The children to pass to the MUI Box component
 * @param {ReactNode} params.meta - The meta tags to pass to the Helmet component
 * @param {string} params.title - The title of the page
 * @param {ReactNode} params.action - The action to pass to the OptionsDrawer component
 * @example
 * <Page title="Home Page" action={<Button>Click Me</Button>}>
 *  <Typography variant="h1">Home Page</Typography>
 *  <Typography variant="body1">This is the home page</Typography>
 *  <Typography variant="body2">This is the home page</Typography>
 * </Page>
 */
const Page = forwardRef<HTMLDivElement, Props>(
	({ children, title = '', meta, action, ...other }, ref) => {
		const { toggle, onToggle } = useToggle()
		return (
			<>
				<Helmet>
					<title>{`${title} | Minimal-UI`}</title>
					{meta}
				</Helmet>

				<Box ref={ref} {...other}>
					{children}
				</Box>
				{action ? (
					<>
						<OptionsDrawer open={toggle} setOpen={onToggle}>
							{action}
						</OptionsDrawer>

						<Fab
							sx={{
								position: 'fixed',
								bottom: '62px',
								right: '16px',
								display: 'flex',
								justifyContent: 'center',
							}}
							onClick={onToggle}
						>
							<Iconify
								icon={'ep:circle-plus-filled'}
								sx={{ width: '1.5em', height: '1.5em', marginRight: 0 }}
							/>
						</Fab>
					</>
				) : null}
			</>
		)
	}
)
Page.displayName = 'Page'

export default Page
