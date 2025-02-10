export interface IBasePaginatedResponse<T> {
    total?: number;
    numeroPagina?: number;
    tamanhoPagina?: number;
    totalPagina?: number;
    data?: T[];
}
