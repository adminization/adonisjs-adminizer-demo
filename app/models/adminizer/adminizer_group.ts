import { AdminizerGroupSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import AdminizerUser from '#models/adminizer/adminizer_user'

export default class AdminizerGroup extends AdminizerGroupSchema {
  @manyToMany(() => AdminizerUser, {
    pivotTable: 'adminizer_user_groups',
    localKey: 'id',
    pivotForeignKey: 'group_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof AdminizerUser>
}
