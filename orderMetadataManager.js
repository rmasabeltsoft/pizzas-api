'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

/*
 order : {
  orderId: String,
  name: String,
  address: String,
  pizzas: Array of Strings,
  delivery_status: READY_FOR_DELIVERY / DELIVERED
  timestamp: timestamp
}
*/

module.exports.saveCompletedOrder = order => {
	console.log('Se invocó a GuardarPedido');

	order.delivery_status = 'READY_FOR_DELIVERY';

	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE + "-" + process.env.SUFFIX,
		Item: order
	};

	return dynamo.put(params).promise();
};

module.exports.deliverOrder = orderId => {
	console.log('Se invocó a EnviarOrden');

	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE + "-" + process.env.SUFFIX,
		Key: {
			orderId
		},
		ConditionExpression: 'attribute_exists(orderId)',
		UpdateExpression: 'set delivery_status = :v',
		ExpressionAttributeValues: {
			':v': 'DELIVERED'
		},
		ReturnValues: 'ALL_NEW'
	};

	return dynamo
		.update(params)
		.promise()
		.then(response => {
			console.log('Orden entregada');
			return response.Attributes;
		});
};

module.exports.getOrder = orderId => {
	console.log('Se invocó a ObtenerOrden');

	const params = {
		TableName: process.env.COMPLETED_ORDER_TABLE + "-" + process.env.SUFFIX,
		Key: {
			orderId
		}
	};

	return dynamo
		.get(params)
		.promise()
		.then(item => {
			return item.Item;
		});
};