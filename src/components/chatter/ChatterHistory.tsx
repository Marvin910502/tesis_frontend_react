import { Avatar, Stack, Typography } from '@mui/material'
import { Message } from 'src/@types/message'
import Iconify from 'src/components/Iconify'
import { fToNow } from 'src/utils/formatTime'
import { getAvatar } from 'src/@types/user'
import { useCallOdoo } from 'src/hooks/useOdoo'

type Props = {
  ids: number[];
}

export default function ChatterHistory ({ ids }:Props) {
  const { data, isLoading } = useCallOdoo<Message[]>({
    model: 'mail.message',
    method: 'message_format',
    args: [ids],
    kwargs: {
      context: {
      }
    }
  }, `mail.message.${ids.join(',')}`)

  return (
    <>
      {data && !isLoading
        ? (
      <Stack spacing={3} sx={{ py: 3, px: 2.5, bgcolor: 'background.neutral', marginTop: 5 }}>
        {data.map((comment) => (
          <Stack key={comment.id} direction="row" spacing={2}>
            {comment.author_id
              ? (<Avatar src={getAvatar(comment.author_id[0])} sx={{ width: 32, height: 32 }} alt={comment.author_id[1]} />)
              : null}
            <div>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2"> {comment.subject}</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {comment.date && fToNow(comment.date.replace(/-/g, '/'))}
                </Typography>
                {(comment?.partner_ids &&
                  comment?.partner_ids.length > 0)
                  ? (<Iconify icon={'el:envelope'} width={16} height={16} />)
                  : (<Iconify icon={'bytesize:compose'} width={16} height={16} />)
                }
              </Stack>
              {comment.body
                ? (<>
                {<div dangerouslySetInnerHTML={{ __html: comment.body ?? '' }} />}
              </>)
                : (<>{comment.subtype_description}</>)}
            </div>
          </Stack>
        ))}
      </Stack>)
        : null}

    </>)
}
