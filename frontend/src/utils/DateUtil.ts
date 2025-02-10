import moment from 'moment';


export const formatDate = (date: Date | string) : string => {
    return moment(date).format("DD/MM/YYYY");
}

export const formatDatetime = (date: Date | string) : string => {
    return moment(date).parseZone().format("DD/MM/YYYY HH:mm")
}

export const toUTC = (date: Date | string) : string => {
    return moment(date).parseZone().toISOString()
}

export const addMinutes = (minutes: number, date?: Date | string) : Date => {
    
    if(!date){
        date = new Date();
    }

    return moment(date).parseZone().add(minutes, 'minutes').toDate()
}
