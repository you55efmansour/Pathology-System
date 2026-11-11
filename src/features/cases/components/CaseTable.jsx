import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { ArrowUpRight, ArrowUpDown, ArrowUp, ArrowDown, Image, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate, formatNumber } from '@/lib/format';
import { casePath } from '../config/caseConfig';
import { StatusBadge } from './StatusBadge';

export function CaseTable({ cases }) {
  const { t, i18n } = useTranslation();
  const [sorting, setSorting] = useState([]);
  const columns = useMemo(() => [
    { accessorKey: 'accession', header: t('caseId'), cell: ({ row, getValue }) => <div><Link className="case-link" to={casePath(row.original)}><bdi>{getValue()}</bdi></Link><span className="cell-secondary">{t(row.original.report.type === 'normal' ? 'normalReport' : row.original.report.type === 'custom' ? 'customReport' : 'noReport')}</span></div> },
    { accessorKey: 'patientName', header: t('patient'), cell: ({ row, getValue }) => <div className="patient-cell"><span className="patient-avatar" aria-hidden="true">{getValue().split(' ').filter(Boolean).slice(0, 2).map((word) => word[0]).join('') || '—'}</span><div><span className="cell-strong"><bdi>{getValue() || t('untitled')}</bdi></span><span className="cell-secondary"><bdi>{row.original.patientId || t('unspecified')}</bdi></span></div></div> },
    { accessorKey: 'specimenType', header: t('specimen'), cell: ({ row, getValue }) => <div><span><bdi>{getValue() || t('unspecified')}</bdi></span><span className="cell-secondary"><bdi>{row.original.specimenId || '—'}</bdi></span></div> },
    { accessorKey: 'createdAt', header: t('received'), cell: ({ getValue }) => <span className="date-cell">{formatDate(getValue(), i18n.language)}</span> },
    { id: 'slides', header: t('slides'), enableSorting: false, cell: ({ row }) => <span className="image-count"><Image size={15} aria-hidden="true" />{row.original.images.length ? formatNumber(row.original.images.length, i18n.language) : '—'}</span> },
    { accessorKey: 'status', header: t('status'), cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
    { id: 'actions', header: () => <span className="sr-only">{t('actions')}</span>, enableSorting: false, cell: ({ row }) => <Link className="icon-button row-open" to={casePath(row.original)} aria-label={`${t('openCase')} ${row.original.accession}`}><ArrowUpRight size={18} /></Link> },
  ], [t, i18n.language]);
  // eslint-disable-next-line react-hooks/incompatible-library -- This application does not enable React Compiler; TanStack manages table state.
  const table = useReactTable({ data: cases, columns, state: { sorting }, onSortingChange: setSorting, initialState: { pagination: { pageSize: 6 } }, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel(), getPaginationRowModel: getPaginationRowModel() });
  const { pageIndex, pageSize } = table.getState().pagination;
  return <>
    <div className="table-scroll" tabIndex={0} role="region" aria-label={t('worklist')}>
      <table className="case-table"><thead>{table.getHeaderGroups().map((group) => <tr key={group.id}>{group.headers.map((header) => {
        const direction = header.column.getIsSorted();
        const SortIcon = direction === 'asc' ? ArrowUp : direction === 'desc' ? ArrowDown : ArrowUpDown;
        return <th key={header.id} scope="col" aria-sort={direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : undefined}>
          {header.column.getCanSort() ? <button className={direction ? 'sort-active' : ''} onClick={header.column.getToggleSortingHandler()} aria-label={t('sortBy', { field: header.column.columnDef.header })}>{flexRender(header.column.columnDef.header, header.getContext())}<SortIcon size={12} aria-hidden="true" /></button> : flexRender(header.column.columnDef.header, header.getContext())}
        </th>;
      })}</tr>)}</thead><tbody>{table.getRowModel().rows.map((row) => <tr key={row.id}>{row.getVisibleCells().map((cell) => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>)}</tbody></table>
    </div>
    <div className="table-footer"><span>{t('showing', { from: pageIndex * pageSize + 1, to: Math.min((pageIndex + 1) * pageSize, cases.length), total: cases.length })}</span><div className="pagination"><span>{t('page', { current: pageIndex + 1, total: table.getPageCount() })}</span><button className="icon-button" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} aria-label={t('previous')}><ChevronLeft size={17} /></button><button className="icon-button" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} aria-label={t('next')}><ChevronRight size={17} /></button></div></div>
  </>;
}
