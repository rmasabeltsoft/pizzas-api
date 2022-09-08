'use strict';

const { v1: uuidv1 } = require('uuid');

module.exports.realizarPedido = async (event) => {
  console.log('Se invocó a RealizarPedido');
  const orderId = uuidv1();
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'El pedido fue registrado con orden #: ${orderId}',
        input: event,
      },
      null,
      2
    ),
  };
};
