import type HttpServer from './HttpServer'
import express from 'express'

export default class ExpressAdapter implements HttpServer {
  app: any

  constructor() {
    this.app = express()
    this.app.use(express.json())
  }

  register(method: string, url: string, callback: any): void {
    this.app[method](url, async function (req: express.Request, res: express.Response) {
      try {
        const output = await callback(req.params, req.body)
        res.json(output)
      } catch (error: any) {
        res.status(422).json({ message: error.message })
      }
    })
  }

  listen(port: number): void {
    this.app.listen(port)
  }
}
