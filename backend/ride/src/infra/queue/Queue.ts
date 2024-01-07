import amqp from 'amqplib'

export default class Queue {
  async publish(queue: string, data: any): Promise<void> {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)))
  }

  async consume(queue: string, callback: any): Promise<void> {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()
    await channel.assertQueue(queue, { durable: true })
    await channel.consume(
      queue,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (message: amqp.ConsumeMessage | null) => {
        if (!message) return
        const input = JSON.parse(message?.content.toString())
        try {
          console.log(input) // TODO: remove after
          await callback(input)
          channel.ack(message)
        } catch (error) {
          console.log(error)
        }
      },
    )
  }
}
