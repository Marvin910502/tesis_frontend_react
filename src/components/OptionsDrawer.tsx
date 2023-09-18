import { Box } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import List, { ListProps } from '@mui/material/List'
import React from 'react'

interface OptionsDrawerProps {
  open: boolean
  setOpen: (open: boolean) => void
  children: ListProps['children']
}

/**
 * @component OptionsDrawer
 * @description A wrapper for the MUI Drawer component
 * @param {boolean} open - If true, the drawer will be open
 * @param {function} setOpen - A function to set the open state
 * @param {ListProps['children']} children - The children to pass to the MUI List component
 * @example
 * <OptionsDrawer open={open} setOpen={setOpen}>
 *   <ListItem button onClick={handleClick}>
 *    <ListItemText primary="Trash" />
 *   </ListItem>
 *   <ListItem button onClick={handleClick}>
 *     <ListItemText primary="Spam" />
 *   </ListItem>
 * </OptionsDrawer>
 */
export function OptionsDrawer({ open, setOpen, children }: OptionsDrawerProps) {
	const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    	if (
    		event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
    	) {
    		return
    	}

    	setOpen(open)
    }

	return (
		<Drawer anchor="bottom" open={open} onClose={toggleDrawer(false)} sx={{}}>
			<div
				// className={classes.list}
				role="presentation"
				onClick={toggleDrawer(false)}
				onKeyDown={toggleDrawer(false)}
			>
				<div>
					<Box
						sx={{
							height: '4px',
							borderRadius: '2px',
							width: '70px',
							margin: 'auto',
							marginTop: '9px',
						}}
					/>
				</div>
				<List>{children}</List>
			</div>
		</Drawer>
	)
}
