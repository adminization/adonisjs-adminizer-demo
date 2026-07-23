import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adminizer_history_actions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('model_id').notNullable()
      table.string('model_name').notNullable()
      table.string('action').notNullable()
      table.json('data').nullable()
      table.json('diff').nullable()
      table
        .integer('user_id')
        .nullable()
        .references('id')
        .inTable('adminizer_users')
        .onDelete('SET NULL')
      table.boolean('is_current').notNullable().defaultTo(true)
      table.boolean('preview').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
