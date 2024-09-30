'use strict'

const {
    connectToRabbitMQForTest
} = require('../db/init.rabbit')

describe('RabbitMQ Connection', () => {
    it('should connect to successful RabbitMQ', async () => {
        const result = await connectToRabbitMQForTest()
        expect(result).toBeUndefined();
    })
})