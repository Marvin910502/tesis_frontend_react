// routes
import Router from 'src/routes'
// theme
import ThemeProvider from 'src/theme'
// components
import Settings from 'src/components/settings'
import RtlLayout from 'src/components/RtlLayout'
import ScrollToTop from 'src/components/ScrollToTop'
import { ProgressBarStyle } from 'src/components/ProgressBar'
import ThemeColorPresets from 'src/components/ThemeColorPresets'
import MotionLazyContainer from 'src/components/animate/MotionLazyContainer'
import NotistackProvider from 'src/components/NotistackProvider'

// ----------------------------------------------------------------------

export default function App() {
	return (
		<ThemeProvider>
			<ThemeColorPresets>
				<NotistackProvider>
					<RtlLayout>
						<MotionLazyContainer>
							<ProgressBarStyle />
							<Settings />
							<ScrollToTop />
							<Router />
						</MotionLazyContainer>
					</RtlLayout>
				</NotistackProvider>
			</ThemeColorPresets>
		</ThemeProvider>
	)
}
