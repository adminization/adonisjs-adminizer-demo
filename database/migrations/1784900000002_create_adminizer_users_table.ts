import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adminizer_users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('login').notNullable().unique()
      table.string('password_hashed').notNullable()
      table.string('full_name').notNullable()
      table.string('email').nullable()
      table.string('avatar').nullable()
      table.string('timezone').nullable()
      table.timestamp('expires').nullable()
      table.string('locale').nullable()
      table.boolean('is_deleted').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.boolean('is_administrator').notNullable().defaultTo(false)
      table.boolean('is_confirmed').notNullable().defaultTo(false)
      table.string('api_key').nullable()
      table.json('widgets').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
