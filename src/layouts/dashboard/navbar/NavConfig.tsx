// components
import SvgIconStyle from '../../../components/SvgIconStyle'

// ----------------------------------------------------------------------

const getIcon = (name: string) => (
	<SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />
)

const ICONS = {
	user: getIcon('ic_user'),
	ecommerce: getIcon('ic_ecommerce'),
	analytics: getIcon('ic_analytics'),
	dashboard: getIcon('ic_dashboard'),
	customer: getIcon('ic_customer'),
}

const navConfig = [
	// GENERAL
	// ----------------------------------------------------------------------
	{
		subheader: 'Contactos',
		items: [
			{ title: 'customer', path: '/app/partner', icon: ICONS.customer },
			{ title: 'Proveedores', path: '/app/two', icon: ICONS.ecommerce },
		],
	},
	{
		subheader: 'Ventas',
		items: [{ title: 'CRM', path: '/app/lead', icon: ICONS.dashboard }],
	},
]

export default navConfig
