'use strict';

const { v1: uuidv1 } = require('uuid');
const AWS = require('aws-sdk');

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

	console.log(event);
	callback();
};

function sendResponse(statusCode, message, callback) {
	const response = {
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}
