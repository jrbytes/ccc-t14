export default interface HttpServer {
  register: (method: string, url: string, callback: any) => void
  listen: (port: number) => void
}
