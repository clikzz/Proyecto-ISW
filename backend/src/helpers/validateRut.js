const validarDigitoVerificador = (rutCompleto) => {
  const [rut, dv] = rutCompleto.split('-');
  let suma = 0;
  let multiplicador = 2;

  for (let i = rut.length - 1; i >= 0; i--) {
    suma += multiplicador * parseInt(rut[i], 10);
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }

  const resto = suma % 11;
  const dvCalculado =
    11 - resto === 11 ? '0' : 11 - resto === 10 ? 'k' : `${11 - resto}`;

  return dv.toLowerCase() === dvCalculado;
};

const limpiarRut = (rut) => rut.replace(/\./g, '').replace('-', '');

module.exports = {
  validarDigitoVerificador,
  limpiarRut,
};
