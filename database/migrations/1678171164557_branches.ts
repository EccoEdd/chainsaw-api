import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'branches'

  public async up () {
    this.schema.createTable('branches', (table) => {
      table.increments('id').primary()
      table.string('name', 45).unique().notNullable()
      table.string('location').unique().notNullable()
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
