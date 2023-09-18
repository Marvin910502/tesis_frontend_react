import { defineConfig, loadEnv } from 'vite'

import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, path.resolve(__dirname))
	const HOST_API = env.VITE_APP_HOST_API_KEY
	return {
		resolve: {
			alias: [
				{
					find: /^src\/(.*)$/,
					replacement: '/src/$1',
				},
			],
		},
		plugins: [react()],
		server: {
			open: false,
			port: 3000,
			proxy: {
				'/web': {
					target: HOST_API,
					changeOrigin: true,
					rewrite: (path) => {
						return path
					},
				},
			},
		},
		define: {
			'process.env': env,
		},
	}
})
