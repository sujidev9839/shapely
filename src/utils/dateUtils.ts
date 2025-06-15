import { parse } from 'date-fns'

export const toDate = (date: string) => {

  return parse(date, 'yyyy-MM-dd HH:mm:ss xx', new Date())
}

export function capitalizeWords(str:string) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
