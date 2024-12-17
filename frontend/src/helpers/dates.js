import { format } from 'date-fns';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date || isNaN(new Date(date).getTime())) {
    return 'Fecha inválida';
  }
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  if (!date || isNaN(new Date(date).getTime())) {
    return 'Fecha inválida';
  }
  return format(new Date(date), formatStr);
};
