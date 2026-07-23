import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'adminizer_filters'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').notNullable().primary()
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('model_name').notNullable()
      table.json('conditions').notNullable()
      table.string('sort_field').nullable()
      table.string('sort_direction').nullable()
      table.string('visibility').notNullable().defaultTo('private')
      table
        .integer('owner_id')
        .notNullable()
        .references('id')
        .inTable('adminizer_users')
        .onDelete('CASCADE')
      table.json('group_ids').nullable()
      table.boolean('api_enabled').notNullable().defaultTo(false)
      table.string('api_key').nullable()
      table.string('icon').nullable()
      table.string('color').nullable()
      table.integer('version').notNullable().defaultTo(1)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
