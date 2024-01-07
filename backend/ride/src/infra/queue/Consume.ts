import amqp from 'amqplib'

async function main(): Promise<void> {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('example', { durable: true })
  await channel.consume('example', (message) => {
    if (!message) return
    console.log(JSON.parse(message?.content.toString()))
    channel.ack(message)
  })
}

void main()
