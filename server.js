'use strict'

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require('./src/service/consumerQueue.service')

const queueName = 'test-topic'

// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started ${queueName}`)
// }).catch(err => {
//     console.error(`Message Error: ${err.message}`)
// })

consumerToQueueNormal().then(() => {
    console.log(`Message consumer started`)
}).catch(err => {
    console.error(`Message Error: ${err.message}`)
})

consumerToQueueFailed().then(() => {
    console.log(`Message consumer started`)
}).catch(err => {
    console.error(`Message Error: ${err.message}`)
})