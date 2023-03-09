import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Role {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>, properties) {

    const userRole = await auth.user?.related('role').query().first()

    if (!properties.includes(userRole?.role)) {
      response.abort({message: 'Not authorized'}, 401)
    } else {
      await next()
    }
    
  }
}
