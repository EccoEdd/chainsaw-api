import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name').notNullable()

      table.string('email', 255).notNullable().unique()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()

      table.string('phone', 10).notNullable().unique()
      table.string('code', 6).nullable()
      table.boolean('active').notNullable().defaultTo(false)

      table.integer('role_id').unsigned().notNullable()
      
      table.foreign('role_id')
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')

        table.timestamps()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
