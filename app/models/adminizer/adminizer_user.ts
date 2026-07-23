import { AdminizerUserSchema } from '#database/schema'
import { manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import AdminizerGroup from '#models/adminizer/adminizer_group'

export default class AdminizerUser extends AdminizerUserSchema {
  @manyToMany(() => AdminizerGroup, {
    pivotTable: 'adminizer_user_groups',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'group_id',
  })
  declare groups: ManyToMany<typeof AdminizerGroup>
}
