function path(root: string, sublink: string) {
	return `${root}${sublink}`
}
const ROOTS_AUTH = '/auth'
const ROOTS_DASHBOARD = '/app'
export const PATH_AUTH = {
	root: ROOTS_AUTH,
	login: path(ROOTS_AUTH, '/login'),
	register: path(ROOTS_AUTH, '/register'),
	resetPassword: path(ROOTS_AUTH, '/reset-password'),
}

export const PATH_DASHBOARD = {
	root: ROOTS_DASHBOARD,
}
