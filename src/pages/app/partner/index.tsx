// @mui
import {
	Container,
	Typography,
	Card,
	ListItem,
	ListItemText,
} from '@mui/material'
// hooks
import useSettings from 'src/hooks/useSettings'
// components
import Page from 'src/components/Page'
import { useSearchOdoo } from 'src/hooks/useOdoo'
import { Partner } from 'src/@types/partner'
import { GridColDef, GridToolbar } from '@mui/x-data-grid-pro'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import DataGridProComponent from 'src/components/DataGrid'

export default function PartnerList() {
	const { themeStretch } = useSettings()
	const { data, isLoading } = useSearchOdoo<Partner>(
		{
			model: 'res.partner',
			query: ['id', 'email', 'name', 'street', 'city'],
		},
		'res.partner'
	)

	const TABHEADER: GridColDef[] = [
		{
			field: 'id',
			filterable: false,
		},
		{
			field: 'name',
			filterable: true,
			flex: 1,
		},
		{
			field: 'email',
			filterable: true,
			flex: 1,
		},
		{
			field: 'street',
			filterable: true,
			flex: 1,
		},
		{
			field: 'city',
			filterable: true,
			flex: 1,
		},
	]
	const navigate = useNavigate()
	const options: ReactNode = (
		<>
			<ListItem alignItems={'center'} onClick={() => navigate('/app')} divider>
				<ListItemText sx={{ textAlign: 'center' }} primary={'Crear'} />
			</ListItem>
			<ListItem alignItems={'center'} divider>
				<ListItemText sx={{ textAlign: 'center' }} primary={'Borrar'} />
			</ListItem>
		</>
	)

	return (
		<>
			<Page title="Clientes" action={options}>
				<Container maxWidth={themeStretch ? false : 'xl'}>
					<Typography variant="h3" component="h1" paragraph>
            Clientes
					</Typography>
					<Card
						sx={{
							marginTop: 2,
							padding: 2,
						}}
					>
						<DataGridProComponent
							columns={TABHEADER}
							rows={data?.records ?? []}
							initialState={{
								columns: {
									columnVisibilityModel: {
										id: false,
									},
								},
								pagination: {
									paginationModel: {
										pageSize: 10,
									},
								},
							}}
							loading={isLoading}
							pagination={true}
							onCellClick={(params) => navigate(`/app/partner/${params.id}`)}
							autoHeight={true}
							slots={{
								toolbar: GridToolbar,
							}}
						/>
					</Card>
				</Container>
			</Page>
		</>
	)
}
