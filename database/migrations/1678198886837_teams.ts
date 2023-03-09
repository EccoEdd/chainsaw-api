import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'teams'

  public async up () {
    this.schema.createTable('teams', (table) => {
      table.increments('id').primary()
      table.string('name', 45).unique().notNullable()
      table.boolean('status').defaultTo(true)
      table.integer('branch_id').unsigned().notNullable()
      table.foreign('branch_id')
        .references('id')
        .inTable('branches')
        .onDelete('CASCADE')
      table.timestamps()
    })    
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
