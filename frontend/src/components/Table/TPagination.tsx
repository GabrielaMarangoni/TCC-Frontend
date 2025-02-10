import React from 'react'
import { Page } from './Page'
import { IBasePaginateResponse } from '@/lib/models/BaseModels';
import { useFormContext } from 'react-hook-form';

interface TPaginationProps {
    pageDefaultValue: IBasePaginateResponse<any>;
    onChangePage: (tamanhoPagina: number, numeroPagina: number,) => void;
}

const TPagination: React.FC<TPaginationProps> = ({ pageDefaultValue, onChangePage }: TPaginationProps) => {

    const { setValue }= useFormContext();
    const [page, setPage] = React.useState(pageDefaultValue);
    const pageSizes: number[] = [10, 50, 100, 200, 500]

    let canNextPage: boolean = (((page.numeroPagina || 0)+1) < (page.totalPagina || 0));
    let canPreviousPage: boolean = ((page.numeroPagina || 0) > 0);

    function setPageSize(pageSize: number) {
        page.tamanhoPagina = pageSize;
        page.numeroPagina = 0;

        setPage(page);
        setValue('tamanhoPagina', page.tamanhoPagina);
        setValue('numeroPagina', page.numeroPagina);
    }


    function gotoPage(pageIndex: number) {
        page.numeroPagina = pageIndex;
        setPage(page);
        setValue('tamanhoPagina', pageIndex);
    }

    function previousPage() {
        if (!canPreviousPage) {
            return;
        }
        gotoPage((page.numeroPagina || 1) - 1)
    }

    function nextPage() {
        if (!canNextPage) {
            return;
        }
        gotoPage((page.numeroPagina || 0) + 1)
    }


    // Render the UI for your table
    return (
        <div className="pagination mb-2 flex items-center place-content-start px-4 border-t border-gray-200 pt-2 z-0">
            <span className="px-2">
                Pag. {(page.numeroPagina || 0) + 1} de {page.totalPagina || 0}  /  {(page.total || 0)} reg.
            </span>
            <select
                id="pageSize"
                name="pageSize"
                className="inline-flex z-10 mr-4 max-h-56 rounded-md py-1 text-base border-gray-300 text-gray-700 overflow-auto hover:border-gray-400 focus:ring-primary focus:ring focus:border-primary focus:outline-none  sm:text-sm"
                value={page.tamanhoPagina || 10}
                onChange={e => {
                    setPageSize(Number(e.target.value))
                }}
            >
                {pageSizes.map(pageSize => (
                    <option className='selected:text-primary hover:selected:text-primary' key={pageSize} value={pageSize}>
                        {pageSize} Itens
                    </option>
                ))}
            </select>
            <button type="button" className="z-10 hover:bg-gray-200 text-gray-700 relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium disabled:opacity-30" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 w-5 "+(canPreviousPage?null:"opacity-30")} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <button type="button" className="z-10 hover:bg-gray-200 text-gray-700 relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium" onClick={() => previousPage()} disabled={!canPreviousPage}>
                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 w-5 "+(canPreviousPage?null:"opacity-30")} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
            </button>{' '}
            <button type="button" className="z-10 hover:bg-gray-200 text-gray-700 relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium" onClick={() => nextPage()} disabled={!canNextPage}>
                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 w-5 "+(canNextPage?null:"opacity-30")} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>{' '}
            <button type="button" className="z-10 hover:bg-gray-200 text-gray-700 relative inline-flex items-center px-2 py-2 rounded-md text-sm font-medium" onClick={() => gotoPage((page.totalPagina || 1) - 1)} disabled={!canNextPage}>
                <svg xmlns="http://www.w3.org/2000/svg" className={"h-5 w-5 "+(canNextPage?null:"opacity-30")} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
            </button>{' '}
        </div>
    )
}



export default TPagination


