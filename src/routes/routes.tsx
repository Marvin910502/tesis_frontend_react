import { Suspense, lazy, ElementType, ReactNode } from 'react'
import { Outlet, RouteObject } from 'react-router-dom'
import LoadingScreen from 'src/components/LoadingScreen'
type LoadProps = {
  children?: ReactNode | ReactNode[]
}

const Loadable = (Component: ElementType) => {
	return function Load(props: LoadProps) {
		return (
			<Suspense fallback={<LoadingScreen />}>
				<Component {...props} />
			</Suspense>
		)
	}
}
const Index = Loadable(lazy(() => import('src/pages/index')))
const APPCHILDREN_LAYOUT = Loadable(lazy(() => import('src/pages/app/_layout')))
const APPCHILDRENUSERCHILDREN = Loadable(
	lazy(() => import('src/pages/app/user/index'))
)
const APPCHILDRENPARTNERCHILDREN = Loadable(
	lazy(() => import('src/pages/app/partner/index'))
)
const APPCHILDRENPARTNERCHILDRENID = Loadable(
	lazy(() => import('src/pages/app/partner/[id]'))
)
const APPCHILDRENLEADCHILDREN = Loadable(
	lazy(() => import('src/pages/app/lead/index'))
)
const APPCHILDRENLEADCHILDRENID = Loadable(
	lazy(() => import('src/pages/app/lead/[id]'))
)
const AUTHCHILDREN = Loadable(lazy(() => import('src/pages/auth/index')))
const PAGE404 = Loadable(lazy(() => import('src/pages/page404')))

export const routes: RouteObject[] = [
	{
		path: '',
		element: <Index />,
	},
	{
		path: 'app',
		element: <APPCHILDREN_LAYOUT />,
		children: [
			{
				path: 'user',
				element: <Outlet />,
				children: [
					{
						path: '',
						element: <APPCHILDRENUSERCHILDREN />,
					},
				],
			},
			{
				path: 'partner',
				element: <Outlet />,
				children: [
					{
						path: '',
						element: <APPCHILDRENPARTNERCHILDREN />,
					},
					{
						path: ':id',
						element: <APPCHILDRENPARTNERCHILDRENID />,
					},
				],
			},
			{
				path: 'lead',
				element: <Outlet />,
				children: [
					{
						path: '',
						element: <APPCHILDRENLEADCHILDREN />,
					},
					{
						path: ':id',
						element: <APPCHILDRENLEADCHILDRENID />,
					},
				],
			},
		],
	},
	{
		path: 'auth',
		element: <Outlet />,
		children: [
			{
				path: '',
				element: <AUTHCHILDREN />,
			},
		],
	},
	{
		path: '*',
		element: <PAGE404 />,
	},
]
