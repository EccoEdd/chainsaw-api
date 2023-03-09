import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Active {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    if(!auth.user?.active){
      response.abort({message: 'Not authorized'}, 401)
    }

    await next()
  }
}
