import * as React from 'react'
import {
	useReactTable,
	SortingState,
	getCoreRowModel,
	getSortedRowModel,
	ExpandedState,
	getExpandedRowModel,
	ColumnOrderState,
	ColumnSizingState,
	ColumnFiltersState,
	getFilteredRowModel,
	ColumnDef
} from '@tanstack/react-table'
import { VirtualTable } from '~/components/Table/Table'
import {
	columnOrders,
	columnSizes,
	protocolAddlColumns,
	protocolsColumns,
	recentlyListedProtocolsColumns,
	topGainersAndLosersColumns,
	protocolsByTokenColumns,
	airdropsColumns,
	protocolsByChainColumns
} from './columns'
import useWindowSize from '~/hooks/useWindowSize'
import { IProtocolRow } from './types'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { TVLRange } from '~/components/Filters/protocols/TVLRange'
import { ColumnFilters2 } from '~/components/Filters/common/ColumnFilters'
import { RowFilter } from '~/components/Filters/common/RowFilter'
import { Icon } from '~/components/Icon'

const columnSizesKeys = Object.keys(columnSizes)
	.map((x) => Number(x))
	.sort((a, b) => Number(b) - Number(a))

export function ProtocolsTable({
	data,
	addlColumns,
	removeColumns
}: {
	data: Array<IProtocolRow>
	addlColumns?: Array<string>
	removeColumns?: Array<string>
}) {
	const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: 'tvl' }])
	const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
	const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const windowSize = useWindowSize()

	const columnsData = React.useMemo(
		() =>
			addlColumns || removeColumns
				? [
						...protocolsColumns.filter((c) => !(removeColumns ?? []).includes((c as any).accessorKey)),
						...(addlColumns ?? []).map((x) => protocolAddlColumns[x])
				  ]
				: protocolsColumns,
		[addlColumns, removeColumns]
	)

	const instance = useReactTable({
		data,
		columns: columnsData,
		state: {
			sorting,
			expanded,
			columnOrder,
			columnSizing
		},
		onExpandedChange: setExpanded,
		getSubRows: (row: IProtocolRow) => row.subRows,
		onSortingChange: setSorting,
		onColumnOrderChange: setColumnOrder,
		onColumnSizingChange: setColumnSizing,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	})

	React.useEffect(() => {
		const defaultOrder = instance.getAllLeafColumns().map((d) => d.id)

		const order = windowSize.width
			? columnOrders.find(([size]) => windowSize.width > size)?.[1] ?? defaultOrder
			: defaultOrder

		const cSize = windowSize.width
			? columnSizesKeys.find((size) => windowSize.width > Number(size))
			: columnSizesKeys[0]

		instance.setColumnSizing(columnSizes[cSize])

		instance.setColumnOrder(order)
	}, [windowSize, instance])

	return <VirtualTable instance={instance} />
}

export enum TABLE_CATEGORIES {
	FEES = 'Fees',
	REVENUE = 'Revenue',
	VOLUME = 'Volume',
	TVL = 'TVL'
}

export enum TABLE_PERIODS {
	ONE_DAY = '1d',
	SEVEN_DAYS = '7d',
	ONE_MONTH = '1m'
}

export const protocolsByChainTableColumns = [
	{ name: 'Name', key: 'name' },
	{ name: 'Category', key: 'category' },
	{ name: 'TVL', key: 'tvl', category: TABLE_CATEGORIES.TVL },
	{ name: 'TVL 1d change', key: 'change_1d', category: TABLE_CATEGORIES.TVL, period: TABLE_PERIODS.ONE_DAY },
	{ name: 'TVL 7d change', key: 'change_7d', category: TABLE_CATEGORIES.TVL, period: TABLE_PERIODS.SEVEN_DAYS },
	{ name: 'TVL 1m change', key: 'change_1m', category: TABLE_CATEGORIES.TVL, period: TABLE_PERIODS.ONE_MONTH },
	{ name: 'Mcap/TVL', key: 'mcaptvl', category: TABLE_CATEGORIES.TVL },
	{ name: 'Fees 24h', key: 'fees_24h', category: TABLE_CATEGORIES.FEES, period: TABLE_PERIODS.ONE_DAY },
	{ name: 'Fees 7d', key: 'fees_7d', category: TABLE_CATEGORIES.FEES, period: TABLE_PERIODS.SEVEN_DAYS },
	{ name: 'Fees 30d', key: 'fees_30d', category: TABLE_CATEGORIES.FEES, period: TABLE_PERIODS.ONE_MONTH },
	{ name: 'Revenue 24h', key: 'revenue_24h', category: TABLE_CATEGORIES.REVENUE, period: TABLE_PERIODS.ONE_DAY },
	{ name: 'Revenue 7d', key: 'revenue_7d', category: TABLE_CATEGORIES.REVENUE, period: TABLE_PERIODS.SEVEN_DAYS },
	{ name: 'Revenue 30d', key: 'revenue_30d', category: TABLE_CATEGORIES.REVENUE, period: TABLE_PERIODS.ONE_MONTH },
	{ name: 'User Fees 24h', key: 'userFees_24h', category: TABLE_CATEGORIES.FEES, period: TABLE_PERIODS.ONE_DAY },
	{ name: 'Cumulative Fees', key: 'cumulativeFees', category: TABLE_CATEGORIES.FEES },
	{
		name: 'Holders Revenue 24h',
		key: 'holderRevenue_24h',
		category: TABLE_CATEGORIES.REVENUE,
		period: TABLE_PERIODS.ONE_DAY
	},
	{
		name: 'Holders Revenue 30d',
		key: 'holdersRevenue30d',
		category: TABLE_CATEGORIES.REVENUE,
		period: TABLE_PERIODS.ONE_MONTH
	},
	{
		name: 'Treasury Revenue 24h',
		key: 'treasuryRevenue_24h',
		category: TABLE_CATEGORIES.REVENUE,
		period: TABLE_PERIODS.ONE_DAY
	},
	{
		name: 'Supply Side Revenue 24h',
		key: 'supplySideRevenue_24h',
		category: TABLE_CATEGORIES.REVENUE,
		period: TABLE_PERIODS.ONE_DAY
	},
	{ name: 'P/S', key: 'ps', category: TABLE_CATEGORIES.FEES },
	{ name: 'P/F', key: 'pf', category: TABLE_CATEGORIES.FEES },
	{ name: 'Volume 24h', key: 'volume_24h', category: TABLE_CATEGORIES.VOLUME, period: TABLE_PERIODS.ONE_DAY },
	{ name: 'Volume 7d', key: 'volume_7d', category: TABLE_CATEGORIES.VOLUME, period: TABLE_PERIODS.SEVEN_DAYS },
	{
		name: 'Volume Change 7d',
		key: 'volumeChange_7d',
		category: TABLE_CATEGORIES.VOLUME,
		period: TABLE_PERIODS.SEVEN_DAYS
	},
	{ name: 'Cumulative Volume', key: 'cumulativeVolume', category: TABLE_CATEGORIES.VOLUME }
]

export const defaultColumns = JSON.stringify({
	name: true,
	category: true,
	tvl: true,
	change_1d: true,
	change_7d: true,
	change_1m: true,
	mcaptvl: false,
	fees_24h: true,
	revenue_24h: true,
	fees_7d: false,
	revenue_7d: false,
	fees_30d: false,
	revenue_30d: false,
	holdersRevenue30d: false,
	fees_1y: false,
	revenue_1y: false,
	average_revenue_1y: false,
	userFees_24h: false,
	cumulativeFees: false,
	holderRevenue_24h: false,
	treasuryRevenue_24h: false,
	supplySideRevenue_24h: false,
	pf: false,
	ps: false,
	volume_24h: true,
	volume_7d: false,
	volumeChange_7d: false,
	cumulativeVolume: false
})

export function ProtocolsByChainTable({ data }: { data: Array<IProtocolRow> }) {
	const optionsKey = 'protocolsTableColumns'
	const valuesInStorage = JSON.parse(
		typeof window !== 'undefined' ? window.localStorage.getItem(optionsKey) ?? defaultColumns : defaultColumns
	)
	const [columnVisibility, setColumnVisibility] = React.useState(valuesInStorage)

	const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: 'tvl' }])
	const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const [filterState, setFilterState] = React.useState(null)

	const instance = useReactTable({
		data,
		columns: protocolsByChainColumns,
		state: {
			sorting,
			expanded,
			columnSizing,
			columnVisibility
		},
		sortingFns: {
			alphanumericFalsyLast: (rowA, rowB, columnId) => {
				const desc = sorting.length ? sorting[0].desc : true

				let a = (rowA.getValue(columnId) ?? null) as any
				let b = (rowB.getValue(columnId) ?? null) as any

				/**
				 * These first 3 conditions keep our null values at the bottom.
				 */
				if (a === null && b !== null) {
					return desc ? -1 : 1
				}

				if (a !== null && b === null) {
					return desc ? 1 : -1
				}

				if (a === null && b === null) {
					return 0
				}

				// at this point, you have non-null values and you should do whatever is required to sort those values correctly
				return a - b
			}
		},
		filterFromLeafRows: true,
		onExpandedChange: setExpanded,
		getSubRows: (row: IProtocolRow) => row.subRows,
		onSortingChange: (updater) => {
			setSorting((old) => {
				const newSorting = updater instanceof Function ? updater(old) : updater

				if (newSorting.length === 0 && old.length === 1) {
					const currentDesc = old[0].desc
					if (currentDesc === undefined) {
						return [{ ...old[0], desc: false }]
					} else if (currentDesc === false) {
						return [{ ...old[0], desc: true }]
					} else {
						return [{ ...old[0], desc: undefined }]
					}
				}

				return newSorting
			})
		},
		onColumnSizingChange: setColumnSizing,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	})

	const clearAllOptions = () => {
		window.localStorage.setItem(optionsKey, '{}')
		instance.getToggleAllColumnsVisibilityHandler()({ checked: false } as any)
	}
	const toggleAllOptions = () => {
		const ops = JSON.stringify(Object.fromEntries(protocolsByChainTableColumns.map((option) => [option.key, true])))
		window.localStorage.setItem(optionsKey, ops)
		instance.getToggleAllColumnsVisibilityHandler()({ checked: true } as any)
	}

	const addOption = (newOptions, setLocalStorage = true) => {
		const ops = Object.fromEntries(
			instance.getAllLeafColumns().map((col) => [col.id, newOptions.includes(col.id) ? true : false])
		)
		if (setLocalStorage) window.localStorage.setItem(optionsKey, JSON.stringify(ops))
		instance.setColumnVisibility(ops)
	}
	const setFilter = (key) => (newState) => {
		const stateToSet = newState === filterState ? null : newState
		const newOptions = protocolsByChainTableColumns
			.filter((column) => (column[key] !== undefined && stateToSet !== null ? column[key] === newState : true))
			.map((op) => op.key)

		addOption(newOptions, false)
		setFilterState(stateToSet)
	}

	const selectedOptions = instance
		.getAllLeafColumns()
		.filter((col) => col.getIsVisible())
		.map((col) => col.id)

	return (
		<>
			<ListOptions>
				<ListHeader>Protocol Rankings</ListHeader>
				<RowFilter
					setValue={setFilter('category')}
					selectedValue={filterState}
					values={Object.values(TABLE_CATEGORIES) as Array<string>}
				/>
				<RowFilter
					setValue={setFilter('period')}
					selectedValue={filterState}
					values={Object.values(TABLE_PERIODS) as Array<string>}
				/>
				<ColumnFilters2
					label={'Columns'}
					options={protocolsByChainTableColumns}
					clearAllOptions={clearAllOptions}
					toggleAllOptions={toggleAllOptions}
					selectedOptions={selectedOptions}
					addOption={addOption}
					subMenu={false}
				/>
				<TVLRange />
			</ListOptions>
			<PTable instance={instance} />
		</>
	)
}

const PTable = styled(VirtualTable)`
	table {
		table-layout: auto;
	}

	th:first-child {
		min-width: 180px;
	}

	th:not(:first-child) > * {
		padding-left: 12px;
	}

	thead > tr:first-child {
		th > * {
			width: fit-content;
			margin: 0 auto;
			padding-left: 0;
		}
	}

	@media (min-width: ${({ theme: { bpLg } }) => bpLg}) {
		th:first-child {
			min-width: 240px;
		}
	}
`

export function ProtocolsTableWithSearch({
	data,
	addlColumns,
	removeColumns,
	skipVirtualization,
	columns
}: {
	data: Array<IProtocolRow>
	addlColumns?: Array<string>
	removeColumns?: Array<string>
	skipVirtualization?: boolean
	columns?: ColumnDef<any>[]
}) {
	const columnsToUse = React.useMemo(() => columns ?? protocolsColumns, [columns])
	const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: 'tvl' }])
	const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([])
	const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const windowSize = useWindowSize()

	const columnsData = React.useMemo(
		() =>
			addlColumns || removeColumns
				? [
						...(columnsToUse as any).filter((c) => !(removeColumns ?? []).includes((c as any).accessorKey)),
						...(addlColumns ?? []).map((x) => protocolAddlColumns[x])
				  ]
				: columnsToUse,
		[addlColumns, removeColumns, columnsToUse]
	)

	const instance = useReactTable({
		data,
		columns: columnsData,
		state: {
			sorting,
			expanded,
			columnOrder,
			columnSizing,
			columnFilters
		},
		filterFromLeafRows: true,
		onExpandedChange: setExpanded,
		getSubRows: (row: IProtocolRow) => row.subRows,
		onSortingChange: setSorting,
		onColumnOrderChange: setColumnOrder,
		onColumnSizingChange: setColumnSizing,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	})

	React.useEffect(() => {
		const defaultOrder = instance.getAllLeafColumns().map((d) => d.id)

		const order = windowSize.width
			? columnOrders.find(([size]) => windowSize.width > size)?.[1] ?? defaultOrder
			: defaultOrder

		const cSize = windowSize.width
			? columnSizesKeys.find((size) => windowSize.width > Number(size))
			: columnSizesKeys[0]

		instance.setColumnSizing(columnSizes[cSize])

		instance.setColumnOrder(order)
	}, [windowSize, instance])

	const [projectName, setProjectName] = React.useState('')

	React.useEffect(() => {
		const columns = instance.getColumn('name')

		const id = setTimeout(() => {
			columns.setFilterValue(projectName)
		}, 200)

		return () => clearTimeout(id)
	}, [projectName, instance])

	return (
		<>
			<div className="relative w-full sm:max-w-[280px] ml-auto">
				<Icon
					name="search"
					height={16}
					width={16}
					className="absolute text-[var(--text3)] top-0 bottom-0 my-auto left-2"
				/>
				<input
					value={projectName}
					onChange={(e) => {
						setProjectName(e.target.value)
					}}
					placeholder="Search protocols..."
					className="border border-black/10 dark:border-white/10 w-full p-2 pl-7 bg-white dark:bg-black text-black dark:text-white rounded-md text-sm"
				/>
			</div>
			<VirtualTable instance={instance} skipVirtualization={skipVirtualization} />
		</>
	)
}

export function RecentlyListedProtocolsTable({ data }: { data: Array<IProtocolRow> }) {
	const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: 'listedAt' }])
	const [columnSizing, setColumnSizing] = React.useState<ColumnSizingState>({})
	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const windowSize = useWindowSize()
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

	const router = useRouter()

	const instance = useReactTable({
		data,
		columns: router.pathname === '/airdrops' ? airdropsColumns : recentlyListedProtocolsColumns,
		state: {
			sorting,
			expanded,
			columnSizing,
			columnFilters
		},
		onExpandedChange: setExpanded,
		getSubRows: (row: IProtocolRow) => row.subRows,
		onSortingChange: setSorting,
		onColumnSizingChange: setColumnSizing,
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getExpandedRowModel: getExpandedRowModel()
	})

	React.useEffect(() => {
		const cSize = windowSize.width
			? columnSizesKeys.find((size) => windowSize.width > Number(size))
			: columnSizesKeys[0]

		instance.setColumnSizing(columnSizes[cSize])
	}, [windowSize, instance])
	const [projectName, setProjectName] = React.useState('')

	React.useEffect(() => {
		const columns = instance.getColumn('name')

		const id = setTimeout(() => {
			columns.setFilterValue(projectName)
		}, 200)

		return () => clearTimeout(id)
	}, [projectName, instance])

	return (
		<>
			<div className="relative w-full sm:max-w-[280px] ml-auto -mb-6">
				<Icon
					name="search"
					height={16}
					width={16}
					className="absolute text-[var(--text3)] top-0 bottom-0 my-auto left-2"
				/>
				<input
					value={projectName}
					onChange={(e) => {
						setProjectName(e.target.value)
					}}
					placeholder="Search protocols..."
					className="border border-black/10 dark:border-white/10 w-full p-2 pl-7 bg-white dark:bg-black text-black dark:text-white rounded-md text-sm"
				/>
			</div>
			<VirtualTable instance={instance} />
		</>
	)
}

export function TopGainersAndLosers({ data }: { data: Array<IProtocolRow> }) {
	const [sorting, setSorting] = React.useState<SortingState>([])

	const instance = useReactTable({
		data,
		columns: topGainersAndLosersColumns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	})

	return <VirtualTable instance={instance} />
}

export function ProtocolsByToken({ data }: { data: Array<{ name: string; amountUsd: number }> }) {
	const [sorting, setSorting] = React.useState<SortingState>([{ desc: true, id: 'amountUsd' }])

	const instance = useReactTable({
		data,
		columns: protocolsByTokenColumns,
		state: {
			sorting
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel()
	})

	return <VirtualTable instance={instance} />
}

export const ListOptions = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin: 0 0 -12px;
	justify-content: space-between;
	flex-wrap: wrap;

	button {
		font-weight: 600;
	}
`

export const ListHeader = styled.h3`
	font-size: 1.125rem;
	color: ${({ theme }) => theme.text1};
	font-weight: 500;
	white-space: nowrap;
	margin-right: auto;

	@media screen and (max-width: 40rem) {
		font-size: 1rem;
	}
`
