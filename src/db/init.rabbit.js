'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        if(!connection) throw new Error('Connection not established!')
        
        const channel = await connection.createChannel()        
        return { channel, connection }
    } catch (error) {
        console.error(error)
    }
}

const connectToRabbitMQForTest = async () => {
    try {
        const { channel, connection } = await connectToRabbitMQ()
        
        // Publish message to a queue
        const queue = 'test-queue'
        const message = 'Hello, I am Phuc'
        await channel.assertQueue(queue)        // create Queue
        await channel.sendToQueue(queue, Buffer.from(message))

        // Close the connection
        await connection.close()
    } catch (error) {
        console.log(`Error connecting to RabbitMQ`, error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(
            queueName,
            { durable: true } 
        )
        console.log(`Waiting for message...`)

        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName} ::`, msg.content.toString())
            /**
             * 1 - find User following SHOP
             * 2 - send message to User
             * 3 - yes, ok => success
             * 4 - error, setup DLX ...
             */
        }, {
            noAck: true // ? Nếu bị lỗi -> hệ thống gửi lại nếu set "noAck: false"
        })
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTest,
    consumerQueue
}