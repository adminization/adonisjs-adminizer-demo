import { AdminizerHistoryActionSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AdminizerUser from '#models/adminizer/adminizer_user'

export default class AdminizerHistoryAction extends AdminizerHistoryActionSchema {
  @belongsTo(() => AdminizerUser, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof AdminizerUser>
}
