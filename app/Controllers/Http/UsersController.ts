// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'


export default class UsersController {
    async logIn({ request, response, auth }) {
        console.log('This is the LogIn')
        const logInSchema = schema.create({
          email: schema.string({ trim: true }, [
            rules.required(),
            rules.email(),
          ]),
          password: schema.string({}, [
            rules.required()
          ])
        });
      
        try {
            const payload = await request.validate({
                schema: logInSchema,
                messages: {
                'email.required': 'Email is required',
                'email.email': 'Email must be a valid email address',
                'password.required': 'Password is required'
                },
            });
        
            const user = await User.query().where('email', payload.email).where('active', true).first();
        
            if (!user) {
                return response.status(401).json({ message: 'Incorrect email or password' });
            }
    
        
            const token = await auth.use('api').attempt(payload.email, payload.password);
      
            return response.json({message: 'Welcome', token: token.token})
        } catch (error) {
            return response.status(400).json({ message: 'Invalid credentials', errors: error.messages });
        }
    }  

    public async logout( {response, auth} ){
        console.log('This is the logOut')
        await auth.use('api').revoke()
        return response.json({ message: 'Good Bye' });
    }

    public async register(){

    }

}
