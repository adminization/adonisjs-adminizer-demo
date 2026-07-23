import { AdminizerNotificationSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import AdminizerUserNotification from '#models/adminizer/adminizer_user_notification'

export default class AdminizerNotification extends AdminizerNotificationSchema {
  @hasMany(() => AdminizerUserNotification, { foreignKey: 'notificationId' })
  declare userNotifications: HasMany<typeof AdminizerUserNotification>
}
