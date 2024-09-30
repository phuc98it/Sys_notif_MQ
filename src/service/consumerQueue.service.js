'use strict'

const { connectToRabbitMQ, consumerQueue } = require("../db/init.rabbit")

const log = console.log
console.log = function () {
    log.apply(console, [new Date()].concat(arguments))
}

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel, connection } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)     // define Consumer
        } catch (error) {
            console.error(`Error consumerToQueue : `, error)
        }
    },

    // case processing
    consumerToQueueNormal: async () => {
        try {
            const { channel, connection } = await connectToRabbitMQ()

            const notifQueue = 'notificationQueueProcess'   // assertQueue

            // channel.consume(notifQueue, msg => {
            //     console.log('Send notification Queue successfully processed :: ', msg.content.toString())
            //     channel.ack(msg)
            // })

            /*  Case "Fail"
            setTimeout(() => {
                channel.consume(notifQueue, msg => {
                    console.log('Send notification Queue successfully processed :: ', msg.content.toString())
                    channel.ack(msg)
                })
            }, 15000)
            */
           channel.consume(notifQueue, msg => {
            try {
                const numberTest = Math.random()
                console.log({numberTest})
                if(numberTest < 0.8) {
                    throw new Error('Send notification Failed!')
                }

                console.log('Send notification Success!')
                channel.ack(msg)
            } catch (error) {
                channel.nack(msg, false, false)     // negative acknowledgment
            }
           })

            
        } catch (error) {
            console.error(error)
        }
    },

    // case "Failed" processing
    consumerToQueueFailed: async () => {
        try {
            const { channel, connection } = await connectToRabbitMQ()

            const notificationExchangeDLX = 'notificationExDLX'             // Exchange 
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'   // assertQueue
            const notificationQueueHandlerHotfix = 'notificationQueueHotfix'

            await channel.assertExchange(
                notificationExchangeDLX,
                'direct',
                { durable: true }
            )

            const queueResult = await channel.assertQueue(notificationQueueHandlerHotfix, {
                exclusive: false
            })

            // Binding
            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msgFailed => {
                console.log(`This notification error : , pls hot fix :: `, msgFailed.content.toString())
            }, {
                noAck: true
            })
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = messageService