import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adminizer_user_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('adminizer_users').onDelete('CASCADE')
      table.integer('group_id').unsigned().notNullable().references('id').inTable('adminizer_groups').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
