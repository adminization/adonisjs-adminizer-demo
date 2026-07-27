import type { ApplicationService } from '@adonisjs/core/types'
import ModuleProvider from './providers/ModuleProvider.js'

// Экспортируем провайдер как default
export default ModuleProvider

// Экспортируем типы
export * from './types.js'

// Дополнительная функция конфигурации (опционально)
export function configure(_app: ApplicationService) {
  console.log('🔧 Configuring module...')
}
