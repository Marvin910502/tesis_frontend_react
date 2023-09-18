import { capitalCase } from 'change-case'
// @mui
import { Container, Tab, Box, Tabs } from '@mui/material'
// hooks
import useTabs from 'src/hooks/useTabs'
import useSettings from 'src/hooks/useSettings'
// _mock_
// import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from 'src/_mock'
// components
import Page from 'src/components/Page'
import Iconify from 'src/components/Iconify'

// sections
import {
	AccountChangePassword,
	AccountGeneral,
	AccountPreferences,
	// AccountBilling,
	// AccountSocialLinks,
	// AccountNotifications,
	// AccountChangePassword
} from 'src/sections/account'
import useLocales from 'src/hooks/useLocales'

// ----------------------------------------------------------------------

export default function Index() {
	const { themeStretch } = useSettings()
	const { translate } = useLocales()

	const { currentTab, onChangeTab } = useTabs(
		translate('profile.tab', { defaultValue: 'general' })
	)

	const ACCOUNT_TABS = [
		{
			value: translate('profile.tab', { defaultValue: 'general' }),
			icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
			component: <AccountGeneral />,
		},
		{
			value: 'password',
			icon: <Iconify icon={'ic:round-lock'} width={20} height={20} />,
			component: <AccountChangePassword />,
		},
		{
			value: 'preferences',
			icon: <Iconify icon={'ic:round-settings'} width={20} height={20} />,
			component: <AccountPreferences />,
		},
		// {
		//   value: 'billing',
		//   icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
		//   component: (
		//     <AccountBilling
		//       cards={_userPayment}
		//       addressBook={_userAddressBook}
		//       invoices={_userInvoices}
		//     />
		//   )
		// },
		// {
		//   value: 'notifications',
		//   icon: <Iconify icon={'eva:bell-fill'} width={20} height={20} />,
		//   component: <AccountNotifications />
		// },
		// {
		//   value: 'social_links',
		//   icon: <Iconify icon={'eva:share-fill'} width={20} height={20} />,
		//   component: <AccountSocialLinks myProfile={_userAbout} />
		// }

		// {
		//   value: 'change_password',
		//   icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
		//   component: <AccountChangePassword />
		// }
	]

	return (
		<Page
			title={translate('profile.title', {
				defaultValue: 'User: Account Settings',
			})}
		>
			<Container maxWidth={themeStretch ? false : 'lg'}>
				{/* <HeaderBreadcrumbs */}
				{/*  heading={translate('settings.title', { defaultValue: 'Settings' })} */}
				{/*  links={[]} */}
				{/* /> */}

				<Tabs
					allowScrollButtonsMobile
					variant="scrollable"
					scrollButtons="auto"
					value={currentTab}
					onChange={onChangeTab}
				>
					{ACCOUNT_TABS.map((tab) => (
						<Tab
							disableRipple
							key={tab.value}
							label={capitalCase(tab.value)}
							icon={tab.icon}
							value={tab.value}
						/>
					))}
				</Tabs>

				<Box sx={{ mb: 5 }} />

				{ACCOUNT_TABS.map((tab) => {
					const isMatched = tab.value === currentTab
					return isMatched && <Box key={tab.value}>{tab.component}</Box>
				})}
			</Container>
		</Page>
	)
}
