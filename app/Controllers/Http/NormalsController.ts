// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NormalsController {
    public async viewCheck({request, response, view}){
        if (!request.hasValidSignature()) {
            return response.abort({message: 'XD'}, 401)
        }
        return view.render('last_view')
    }
}
