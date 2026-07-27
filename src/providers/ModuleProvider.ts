import type { ApplicationService } from '@adonisjs/core/types'

export default class ModuleProvider {
  constructor(protected app: ApplicationService) {}

  register() {
    console.log('📦 ModuleProvider: register')
  }

  async boot() {
    console.log('🚀 ModuleProvider: boot')
  }

  async start() {
    console.log('⚡ ModuleProvider: start')
  }

  async shutdown() {
    console.log('🛑 ModuleProvider: shutdown')
  }
}
