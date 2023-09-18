// hooks
import useAuth from '../hooks/useAuth'
// utils
import createAvatar from 'src/utils/createAvatar'
//
import Avatar, { Props as AvatarProps } from './Avatar'

// ----------------------------------------------------------------------

/**
 * @component MyAvatar
 * @description MyAvatar is the avatar of the users in the app
 * @param {AvatarProps} props - props to pass to the Avatar component
 * @param {string} props.alt - alt text for the avatar
 * @param {string} props.color - color of the avatar
 * @returns {React.Component}
 */
export default function MyAvatar({ ...other }: AvatarProps) {
	const { user } = useAuth()
	const { name, color } = createAvatar(user?.name ?? '')
	return (
		<Avatar alt={user?.name} color={color} {...other}>
			{name}
		</Avatar>
	)
}
