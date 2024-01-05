export default class Registry {
  dependencies: Record<string, any>
  static instance: Registry

  private constructor() {
    this.dependencies = {}
  }

  register(name: string, dependency: any): void {
    this.dependencies[name] = dependency
  }

  inject(name: string): any {
    if (!this.dependencies[name]) {
      throw new Error(`Dependency ${name} not found`)
    }
    return this.dependencies[name]
  }

  static getInstance(): Registry {
    if (!Registry.instance) {
      Registry.instance = new Registry()
    }
    return Registry.instance
  }
}

export function inject(name: string) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] = new Proxy(
      {},
      {
        get(target: any, propertyKey: string) {
          const dependency = Registry.getInstance().inject(name)
          return dependency[propertyKey]
        },
      },
    )
  }
}
