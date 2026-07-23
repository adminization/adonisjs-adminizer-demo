import { AdminizerFilterColumnSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AdminizerFilter from '#models/adminizer/adminizer_filter'

export default class AdminizerFilterColumn extends AdminizerFilterColumnSchema {
  @belongsTo(() => AdminizerFilter, { foreignKey: 'filterId' })
  declare filter: BelongsTo<typeof AdminizerFilter>
}
