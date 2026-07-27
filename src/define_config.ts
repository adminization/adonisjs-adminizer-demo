import type { LucidModelRegistration } from '../lib/lucid_adapter.js'

export interface AdminizerSystemConfig {
    models: Record<string, LucidModelRegistration>
    systemModels: Record<string, string>
}

export function defineConfig(config: AdminizerSystemConfig): AdminizerSystemConfig {
    return config
}
