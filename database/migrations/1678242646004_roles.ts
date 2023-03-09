import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable('roles', (table) => {
      table.increments('id').primary()

      table.string('role', 1)
        .unique()
        .notNullable()

      table.string('description')

      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
