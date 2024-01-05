import type Logger from '../../application/logger/Logger'

export default class LoggerConsole implements Logger {
  log(message: string): void {
    console.log(message)
  }
}
