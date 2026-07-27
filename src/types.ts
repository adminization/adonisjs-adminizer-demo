export interface ModuleConfig {
  enabled: boolean
  prefix: string
}

export interface ModuleService {
  getHello(): string
}

declare module '@adonisjs/core/types' {
  export interface ContainerBindings {
    'my-module/services': ModuleService
  }
}
