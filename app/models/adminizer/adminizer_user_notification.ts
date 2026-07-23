import { AdminizerUserNotificationSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import AdminizerUser from '#models/adminizer/adminizer_user'
import AdminizerNotification from '#models/adminizer/adminizer_notification'

export default class AdminizerUserNotification extends AdminizerUserNotificationSchema {
  @belongsTo(() => AdminizerUser, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof AdminizerUser>

  @belongsTo(() => AdminizerNotification, { foreignKey: 'notificationId' })
  declare notification: BelongsTo<typeof AdminizerNotification>
}
