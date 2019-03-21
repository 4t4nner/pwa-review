import * as moment from 'moment';
import 'moment/locale/ru';

export const getShort = (date) => date ? moment(date).format('D MMMM YYYY') : null
export const getDMYT = (date) => date ? moment(date).format('D MMMM YYYY (HH:mm)'): null