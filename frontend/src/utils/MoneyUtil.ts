
export const formatMoney = (value: number | bigint, digits?: number) : string => {
    
    let fractionDigits = 2;
    if(digits){
        fractionDigits = digits;
    }
    return Intl.NumberFormat('pt-BR', { minimumFractionDigits: fractionDigits }).format(value);
}

