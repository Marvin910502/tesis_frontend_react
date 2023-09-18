// @flow
import * as React from 'react'
import useSettings from 'src/hooks/useSettings'
import { useSearchOdoo } from 'src/hooks/useOdoo'
import { GridColDef, GridToolbar } from '@mui/x-data-grid-pro'
import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'
import {
	Card,
	Container,
	ListItem,
	ListItemText,
	Typography,
} from '@mui/material'
import { Lead } from 'src/@types/lead'
import Page from 'src/components/Page'
import DataGridProComponent from 'src/components/DataGrid'
import useLocales from 'src/hooks/useLocales'

export default function Leads() {
	const { themeStretch } = useSettings()
	const { data, isLoading } = useSearchOdoo<Lead>(
		{
			model: 'crm.lead',
			query: [
				'id',
				'email_from',
				'name',
				'phone',
				'partner_name',
				'street',
				'city',
				'zip',
			],
			sort: 'id DESC',
		},
		'crm.lead'
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
			field: 'email_from',
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
		{
			field: 'zip',
			filterable: true,
			flex: 1,
		},
	]
	const { translate } = useLocales()
	const navigate = useNavigate()
	const options: ReactNode = (
		<>
			<ListItem
				alignItems={'center'}
				onClick={() => navigate('/app/crm/new')}
				divider
			>
				<ListItemText
					sx={{ textAlign: 'center' }}
					primary={translate('leads.list.mnt_create', {
						defaultValue: 'Create New',
					})}
				/>
			</ListItem>
		</>
	)
	return (
		<Page title="Clientes" action={options}>
			<Container maxWidth={themeStretch ? false : 'xl'}>
				<Typography variant="h3" component="h1" paragraph>
          Leads
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
						loading={isLoading}
						pagination={true}
						onCellClick={(params) => navigate(`/app/lead/${params.id}`)}
						autoHeight={true}
						slots={{
							toolbar: GridToolbar,
						}}
					/>
				</Card>
			</Container>
		</Page>
	)
}
