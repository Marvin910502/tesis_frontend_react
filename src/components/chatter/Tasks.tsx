import {
  Avatar,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'

import {
  Mail as MailIcon,
  Phone as PhoneIcon,
  VerifiedUser as VerifiedUserIcon,
  AccessTime as TaskIcon
} from '@mui/icons-material'
import { MailActivity } from 'src/@types/message'
import { getAvatar } from 'src/@types/user'
import createAvatar from 'src/utils/createAvatar'
import { useExecuteOdoo } from 'src/hooks/useOdoo'
import useAuth from 'src/hooks/useAuth'
import { useSnackbar } from 'notistack'
import { fTimestamp, fToNow } from 'src/utils/formatTime'
type Props = {
  tasks: MailActivity[]
  invalidateQuerys: string[]
}
// TODO create TASKS
// TODO send feedback task done

export function TasksList ({ tasks, invalidateQuerys }: Props) {
  const { mutateAsync: callDone } = useExecuteOdoo(invalidateQuerys)
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const getIcon = (task:MailActivity) => {
    const color = fTimestamp(task.date_deadline) < fTimestamp(new Date()) ? 'error' : 'primary'
    switch (task.icon) {
      case 'fa-envelope':
        return <MailIcon color={ color}/>
      case 'fa-phone':
        return <PhoneIcon color={ color} />
      case 'fa-users':
        return <VerifiedUserIcon color={ color}/>
      default:
        return <TaskIcon color={color}/>
    }
  }
  const handleToggle = (value: MailActivity) => () => {
    callDone({
      model: 'mail.activity',
      method: 'action_feedback',
      args: [[value.id]],
      kwargs: {
        context: user?.user_context || {},
        attachment_ids: [],
        feedback: ''

      }

    }).then(() => enqueueSnackbar('Updated', { variant: 'success' }))
      .catch((error) => enqueueSnackbar(error.message, { variant: 'error' }))
  }
  return (
    <List dense sx={{ width: '100%', bgcolor: 'background.neutral', marginTop: 5 }}>
      {tasks.sort((a, b) => fTimestamp(a.date_deadline) - fTimestamp(b.date_deadline)).map((task) => {
        const labelId = `checkbox-list-label-${task.id}`

        return (
          <ListItem
            key={task.id}

            secondaryAction={
              <Checkbox
                edge="start"
                onChange={handleToggle(task)}
                inputProps={{ 'aria-labelledby': labelId }}
              />}
            disablePadding
          >
            <ListItemButton>

              <ListItemIcon>
                {getIcon(task)}
              </ListItemIcon>
              <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${task.user_id[1] + 1}`}
                  src={task.user_id[1] ? getAvatar(task.user_id[0]) : ''}
                >
                  {createAvatar(task.user_id[1]).name}
                </Avatar>
              </ListItemAvatar>
              <ListItemText id={labelId} primary={`${fToNow(task.date_deadline)} ${task.activity_type_id[1]} ${task.summary || ''} for ${task.user_id[1]}`} />

            </ListItemButton>
          </ListItem>)
      })}

    </List>
  )
}
