import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'demons'

  public async up () {
    this.schema.createTable('demons', (table) => {
      table.increments('id')
      table.string('name', 45).unique().notNullable()
      table.string('category').notNullable()
      table.timestamps(true, true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
