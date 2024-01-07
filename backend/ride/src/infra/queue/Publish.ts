import amqp from 'amqplib'

async function main(): Promise<void> {
  const connection = await amqp.connect('amqp://localhost')
  const channel = await connection.createChannel()
  await channel.assertQueue('example', { durable: true })
  const input = {
    a: 4,
    b: 5,
    c: 6,
  }
  channel.sendToQueue('example', Buffer.from(JSON.stringify(input)))
}

void main()
