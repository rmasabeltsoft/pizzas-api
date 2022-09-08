'use strict';

const { v1: uuidv1 } = require('uuid');
const AWS = require('aws-sdk');

const orderMetadataManager = require('./orderMetadataManager');

AWS.config.update({region: process.env.REGION});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const QUEUE_URL = process.env.PENDING_ORDER_QUEUE;

module.exports.realizarPedido = (event, context, callback) => {
  console.log('Se invocó a RealizarPedido');

	const body = JSON.parse(event.body);

	const order = {
		orderId: uuidv1(),
		name: body.name,
		address: body.address,
		pizzas: body.pizzas,
		timestamp: Date.now()
	};

	const params = {
		MessageBody: JSON.stringify(order),
		QueueUrl: QUEUE_URL
	};

	sqs.sendMessage(params, function(err, data) {
		if (err) {
			sendResponse(500, err, callback);
		} else {
			const message = {
				order: order,
				messageId: data.MessageId
			};
			sendResponse(200, message, callback);
		}
	});
};

module.exports.prepararPedido = (event, context, callback) => {
	console.log('Se invocó a PrepararPedido');

	const order = JSON.parse(event.Records[0].body);

	orderMetadataManager
		.saveCompletedOrder(order)
		.then(data => {
			callback();
		})
		.catch(error => {
			callback(error);
		});
};

module.exports.enviarPedido = (event, context, callback) => {
	console.log('enviarPedido fue llamada');

	const record = event.Records[0];
	if (record.eventName === 'INSERT') {
		console.log('deliverOrder');

		const orderId = record.dynamodb.Keys.orderId.S;

		orderMetadataManager
			.deliverOrder(orderId)
			.then(data => {
				console.log(data);
				callback();
			})
			.catch(error => {
				callback(error);
			});
	} else {
		console.log('is not a new record');
		callback();
	}
};

module.exports.estadoPedido = (event, context, callback) => {
	console.log('Estado pedido fue llamado');

	const orderId = event.pathParameters && event.pathParameters.orderId;
	if (orderId !== null) {
		orderMetadataManager
			.getOrder(orderId)
			.then(order => {
				sendResponse(200, 'El estado de la orden: ${orderId} es ${order.delivery_status}', callback);
			})
			.catch(error => {
				sendResponse(500, 'Hubo un error al procesar el pedido', callback);
			});
	} else {
		sendResponse(400, 'Falta el orderId', callback);
	}
};

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}
