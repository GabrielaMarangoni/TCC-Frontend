
import { ReactNode } from 'react';
import { TColumn, TColumnAlign, TColumnType } from './TColumn';
import { formatDate, formatDatetime } from '../../utils/DateUtil';
import { formatMoney } from '../../utils/MoneyUtil';



export const useRenderer = () => {

    const renderCell = (row: any, column: TColumn) : ReactNode => {
        const originalValue = row[column.acessor]

        //Faz a formatacao do conteudo da celula **************************
        let formattedValue: string = originalValue;

        if(column.format){
            formattedValue = column.format(originalValue)
        }else if(column.type === TColumnType.date){
            formattedValue = formatDateCell(originalValue)
        }else if(column.type === TColumnType.timestamp){
            formattedValue = formatTimestampCell(originalValue)
        }else if(column.type === TColumnType.double){
            formattedValue = formatDoubleCell(originalValue)
        }
        //Faz a formatacao do conteudo da celula **************************


        if(column.renderer){
            return column.renderer(formattedValue, row)
        }

        return formattedValue;
    }

    const defaultAlign = (column: TColumn) : TColumnAlign => {
        
        if(column.type === TColumnType.double){
            return TColumnAlign.right
        }

        return TColumnAlign.left;
    }

    const formatDateCell = (value: any) : string => {
        
        if(!value){
            return "";
        }

        return formatDate(value);
    }


    const formatTimestampCell = (value: any) : string => {
        
        if(!value){
            return "";
        }

        return formatDatetime(value)
    }

    const formatDoubleCell = (value: any) : string => {
        
        if(!value){
            return "";
        }

        return formatMoney(value);
    }


    return {
        renderCell,
        defaultAlign
    }
}

export default useRenderer;