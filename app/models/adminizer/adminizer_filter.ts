import { randomUUID } from 'node:crypto'
import { AdminizerFilterSchema } from '#database/schema'
import { beforeCreate, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import AdminizerUser from '#models/adminizer/adminizer_user'
import AdminizerFilterColumn from '#models/adminizer/adminizer_filter_column'

export default class AdminizerFilter extends AdminizerFilterSchema {
  @belongsTo(() => AdminizerUser, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof AdminizerUser>

  @hasMany(() => AdminizerFilterColumn, { foreignKey: 'filterId' })
  declare columns: HasMany<typeof AdminizerFilterColumn>

  @beforeCreate()
  static assignId(filter: AdminizerFilter) {
    if (!filter.id) {
      filter.id = randomUUID()
    }
  }
}
