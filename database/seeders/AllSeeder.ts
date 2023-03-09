import Database from '@ioc:Adonis/Lucid/Database'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    const roles = [
      { role: 'a', description: 'Admin' },
      { role: 'u', description: 'User' },
      { role: 'v', description: 'Void' }
    ]
    await Database.table('roles').insert(roles)

    const user = new User()
    user.id = 1
    user.name = 'Admin'
    user.email = 'admin@gmail.com'
    user.password = 'admin'
    user.phone = '0000000000'
    user.active = true
    user.role_id = 1

    await user.save()
  }
}
