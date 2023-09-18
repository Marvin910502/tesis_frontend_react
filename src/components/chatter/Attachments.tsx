import { Attachment } from 'src/@types/attachment'
import { styled } from '@mui/material/styles'
import { Box, Card, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Image from 'src/components/Image'
import { useSnackbar } from 'notistack'
import { getAttachmentUrl, getPreviewIcon } from 'src/utils/filesUtils'
import { useCreateOdoo, useDeleteOdoo } from 'src/hooks/useOdoo'
import { useDropzone } from 'react-dropzone'
import Iconify from 'src/components/Iconify'
const DropZoneStyle = styled('div')(({ theme }) => ({
  width: 64,
  height: 64,
  fontSize: 24,
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  justifyContent: 'center',
  margin: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  border: `dashed 1px ${theme.palette.divider}`,
  '&:hover': { opacity: 0.72 }
}))
type Props = {
  attachments: Attachment[] | []
  id: number
  model: string
  invalidateQuery: string[]
}
export function AttachmentsList ({ attachments, id, model, invalidateQuery }: Props) {
  const { mutateAsync: deleteAttachment } = useDeleteOdoo(invalidateQuery)

  const handleRemove = (id:number) => {
    deleteAttachment({
      model: 'ir.attachment',
      id
    }).then(() => {
      enqueueSnackbar('Attachment removed', { variant: 'success' })
    })
      .catch((err) => {
        enqueueSnackbar(err.message, { variant: 'error' })
      }
      )
  }
  const { enqueueSnackbar } = useSnackbar()

  return (
    <>
      <Card sx={{ p: 2, mt: 2, flexDirection: 'row', display: 'flex' }}>
      {attachments.map((attachment) => (
        <Box key={attachment.id}
             sx={{
               m: 0.5,
               textAlign: 'center',
               flex: 1
             }}
        >
          <Image
            // key={attachment.id}
            src={getPreviewIcon(attachment.mimetype)}
            onClick={() => window.open(getAttachmentUrl(attachment), '_blank')}
            sx={{
              margin: '0 auto',
              width: 64,
              height: 64,
              borderRadius: 1,
              cursor: 'pointer',
              textAlign: 'center'
            }}
          />

          <Typography variant="caption" sx={{ textAlign: 'center' }}>
            {attachment.name}
          </Typography>
          <DeleteIcon sx={{ cursor: 'pointer', display: 'block', margin: '0 auto' }}
                      onClick={() => handleRemove(attachment.id)}
                      color={'error'}
          />
        </Box>
      ))}
      </Card>

      <UploadFile id={id} model={model} invalidateQuery={invalidateQuery} />

      {/* TODO - add upload LightboxModal */}
      {/* <LightboxModal */}
      {/*   images={imagesLightbox} */}
      {/*   mainSrc={imagesLightbox[selectedImage]} */}
      {/*   photoIndex={selectedImage} */}
      {/*   setPhotoIndex={setSelectedImage} */}
      {/*   isOpen={openLightbox} */}
      {/*   onCloseRequest={() => setOpenLightbox(false)} */}
      {/* /> */}
    </>
  )
}
// TODO invalidate query not working in the second mutation
type UploadFileProps = {
  id: number
  model: string
  invalidateQuery: string[]
}
export function UploadFile ({ id, model, invalidateQuery }: UploadFileProps) {
  const { enqueueSnackbar } = useSnackbar()

  const { mutateAsync: createAttachment } = useCreateOdoo(invalidateQuery)
  const handleDrop = (acceptedFiles: File[]) => {
    const fileReader = new FileReader()
    acceptedFiles.forEach((file: File) => {
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        createAttachment({
          model: 'ir.attachment',
          data: {
            name: file.name,
            res_model: model,
            res_id: id,
            datas: (fileReader.result as string).split(',')[1],
            type: 'binary',
            public: true
          }
        }).then(() => {
          enqueueSnackbar('Attachment added', { variant: 'success' })
        })
          .catch((err) => {
            enqueueSnackbar(err.message, { variant: 'error' })
          }
          )
      }
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop
  })
  return (
    <DropZoneStyle
      {...getRootProps()}
      sx={{
        ...(isDragActive && { opacity: 0.72 })
      }}
    >
      <input {...getInputProps()} />

      <Iconify icon={'eva:plus-fill'} sx={{ color: 'text.secondary' }} />
    </DropZoneStyle>
  )
}
