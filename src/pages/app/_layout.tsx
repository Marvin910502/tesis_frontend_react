import DashboardLayout from 'src/layouts/dashboard'
import AuthGuard from 'src/guards/AuthGuard'

export default function Home() {
	return (
		<AuthGuard>
			<DashboardLayout />
		</AuthGuard>
	)
}
