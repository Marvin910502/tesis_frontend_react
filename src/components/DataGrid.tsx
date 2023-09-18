import { DataGridProProps } from '@mui/x-data-grid-pro/models/dataGridProProps'
import useLocales from 'src/hooks/useLocales'
import { DataGridPro, LicenseInfo } from '@mui/x-data-grid-pro'
import { useEffect, useMemo } from 'react'
import useToggle from 'src/hooks/useToggle'

LicenseInfo.setLicenseKey(
	'61a923721516d57b6516c35635c930dcTz0yODI1MCxFPTE3MTY1NDc3NzU4NDQsUz1wcm8sTE09cGVycGV0dWFsLEtWPTI='
)
const PAGE_SIZES = [5, 10, 20, 50, 100, 200, 500]
/**
 * DataGridProComponent
 * @description DataGridProComponent is a wrapper for DataGridPro from @mui/x-data-grid-pro with default props and custom localeText
 * @param {DataGridProProps} props
 * @param {number[]} props.pageSizeOptions - default: [5, 10, 20, 50, 100, 200, 500]
 * @example
 * [src/pages/app/lead/index.tsx]
 */
export default function DataGridProComponent(props: DataGridProProps) {
	const { translate, currentLang } = useLocales()

	const { toggle, onToggle } = useToggle(true)
	const localeText = useMemo(() => {
		onToggle()
		return {
			...currentLang.datagridValue.components.MuiDataGrid.defaultProps
				.localeText,
			toolbarDensity: translate('datagrid.toolbarDensity', {
				defaultValue: 'size',
			}),
			filterOperatorIsAnyOf: translate('datagrid.filterOperatorIsAnyOf', {
				defaultValue: 'is Any off',
			}),
		}
	}, [translate])
	useEffect(() => {
		onToggle()
	}, [localeText])

	return (
		<>
			{toggle ? (
				<DataGridPro
					pageSizeOptions={PAGE_SIZES}
					{...props}
					localeText={localeText}
				/>
			) : null}
		</>
	)
}
