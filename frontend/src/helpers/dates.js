import { format } from 'date-fns';

export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date || isNaN(new Date(date).getTime())) {
    // Devuelve un mensaje por defecto si la fecha es inválida
    return 'Fecha inválida';
  }
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date, formatStr = 'dd/MM/yyyy HH:mm') => {
  if (!date || isNaN(new Date(date).getTime())) {
    // Devuelve un mensaje por defecto si la fecha es inválida
    return 'Fecha inválida';
  }
  return format(new Date(date), formatStr);
};
