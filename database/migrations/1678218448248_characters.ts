import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'characters'

  public async up () {
    this.schema.createTable('characters', (table) => {
      table.increments('id').primary()
      table.string('name', 15).notNullable()
      table.string('l_name', 15).nullable()
      table.string('type', 20).nullable()
      table.boolean('alive').defaultTo(true)
      table.integer('age').unsigned().nullable()

      table.integer('team_id').unsigned().notNullable()
      
      table.foreign('team_id')
        .references('id')
        .inTable('teams')
        .onDelete('CASCADE')

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
