import { format } from 'date-fns';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  return format(new Date(date), formatStr);
};
