import { ReactNode } from "react";

export enum TColumnType {
    date = "date",
    timestamp = "timestamp",
    double = "double"
}

export enum TColumnAlign {
    left = "left",
    right = "right",
    center = "center"
}

export interface TColumn {
    header: string;
    acessor: string;
    width?: number;
    maxWidth?: number;
    minWidth?: number;
    renderer? : (formattedValue: string, obj: any) => ReactNode;
    format? : (e:any) => any;
    isSorted?: boolean;
    isSortedDesc?: boolean;
    type?: TColumnType;
    dateFormat?: string;
    align?: TColumnAlign;
    cellClass?: string;
    Cell?: (props: { value: any }) => ReactNode;
}