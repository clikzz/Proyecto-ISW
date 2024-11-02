import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAlert } from '@context/alertContext';

const AlertComponent = () => {
  const { alert, closeAlert } = useAlert();

  return (
    <Snackbar
      open={alert.open}
      autoHideDuration={4000} // Duración de la alerta
      onClose={closeAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posición de la alerta
    >
      <Alert
        onClose={closeAlert}
        severity={alert.severity}
        sx={{ width: '100%' }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
