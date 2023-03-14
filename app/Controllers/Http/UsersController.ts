// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Mail from '@ioc:Adonis/Addons/Mail';
import Route from '@ioc:Adonis/Core/Route'
import axios from 'axios';

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

    public async register({response, request}){
        try {
            const newUserSchema = schema.create({
                user: schema.string({ trim: true }, [
                    rules.required()
                ]),
                email: schema.string({ trim: true }, [
                    rules.required(),
                    rules.email(),
                    rules.unique({ table: 'users', column: 'email' })
                ]),
                phone: schema.string({ trim: true }, [
                    rules.required(),
                    rules.unique({ table: 'users', column: 'phone' })
                ]),
                password: schema.string({ trim: true }, [
                    rules.required()
                ])
            })
    
            const payload = await request.validate({
                schema: newUserSchema,
                messages: {
                    'user.required': 'You need to provide a user name',
                    'email.required': 'You need to provide an email address',
                    'email.email': 'Invalid email address',
                    'email.unique': 'This email already exists',
                    'phone.required': 'You need to provide a phone number',
                    'phone.mobile': 'Invalid phone number',
                    'phone.unique': 'This phone number already exists',
                    'password.required': 'You need to provide a password'
                }
            });
    
            const user = new User();
    
            user.name = payload.user;
            user.email = payload.email;
            user.phone = payload.phone;
            user.password = payload.password;
            user.code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
            user.roleId = 2;
    
            await user.save();
            
            const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`
            console.log(baseUrl)

            const nextRoute = baseUrl + Route.makeSignedUrl('link', {
                id: user.id
            },{
                expiresIn: '30m'
            })

            Mail.sendLater((message) => {
                message
                    .from('ChainsawMan')
                    .to(user.email)
                    .subject(`Hello ${user.name}`)
                    .htmlView('emails/welcome',{
                        user: user,
                        next: nextRoute
                    })
            });

            const urlNumber =  baseUrl + Route.makeSignedUrl('number',{
                id: user.id
            },{
                expiresIn: '30m'
            })
    
            return response.status(200).json({
                message: 'Please check your email to continue',
                url: urlNumber
            })

        } catch (error) {
            console.log(error)
            return response.status(400).json({
                message: 'unsuccessful...',
                errors: error.messages
            })
        }
    }

    public async link({request, response, params}){
        if (!request.hasValidSignature()) {
            return response.abort({message: 'Not authorized'}, 401)
        }

        const user = await User.find(params.id)
        
        if(!user){
            return response.status(404).json({ message: 'error 404 not found' });
        }

        if(user.active){
            return response.status(403).json({ message: 'User already verified' })
        }

        this.sendSMS(user)

        const extUrl = 'http://localhost:4200/codeSender'

        Mail.sendLater((message) => {
            message
                .from('ChainsawMan')
                .to(user.email)
                .subject(`Hello ${user.name}`)
                .htmlView('emails/almost',{
                    user: user,
                    next: extUrl
                })
        });

        const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

        const nextRoute = baseUrl + Route.makeSignedUrl('viewPhone', {},{
            expiresIn: '2m'
        })

        return response.redirect().toPath(nextRoute);
    }

    public async number({request, response, params}){
        if (!request.hasValidSignature()) {
            return response.status(401).json({ message: 'Unauthorized' });
        }

        try { 
            const validate = await request.validate({
              schema: schema.create({
                code: schema.string(),
              }),
              messages: {
                required: '{{ field }} is required',
              },
            });
        
            const user = await User.find(params.id);
        
            if (!user) {
              return response.status(404).json({ message: 'User not found' });
            }
        
            if (user.active) {
              return response.status(304).json({ message: 'User already verified' });
            }
        
            if (user.code !== validate.code) {
              return response.status(400).json({ message: 'Verification code is invalid' });
            }
        
            user.active = true;
            await user.save();
        
            return response.status(200).json({ message: 'Welcome' });
        } catch (error) {
            return response.status(400).json({ message: 'unsuccessful...', errors: error.messages });
        }
    }

    public async sendSMS(user: User){
        axios.post('https://rest.nexmo.com/sms/json', {
            from: 'Chainsaw Man',
            api_key: '78addf73',
            api_secret: 'lRbiZj7upNOyROTx',
            to: `52${user.phone}`,
            text: `Your code is: ${user.code}`
        }).then(response => {
            console.log(response.data);
        }).catch(error => {
            console.error(error);
        });
    }

    public async roleCheck({response, auth}){
        const user = auth.user
        if(!user){
            return response.json({ role: false })
        }
        await user.load('role') // load the role relationships

        const role = user.role.Role

        return response.json({ role: role });
    }

    public async checkUsers({ response }) {
        const users = await User.query().preload('role')
        return response.status(202).json({ message: 'all the data...', data: users });
    }

    public async modifyUser ({ request, response, params }) {
        const id = params.id
        const user = await User.find(id)
        
        if (!user) {
          return response.status(404).json({ message: 'error 404 not found' })
        }
      
        const validationRules = {
          email: `required|unique:users,email,id,${id}|email`,
          phone: `required|unique:users,phone,id,${id}|numeric`,
          status: `required|boolean|in:${id == 1 ? '1' : ''}`,
          id: `required|exists:roles|in:${id == 1 ? '1' : ''}`
        }
      
        const validationMessages = {
          'id.required': 'You need the role',
          'status.in': 'You cannot change the status for this one',
          'id.in': 'You cannot change the rol for this one'
        }
      
        try {
          const payload = await request.validate({
            schema: validationRules,
            messages: validationMessages
          })
      
          user.name = payload.user
          user.email = payload.email
          user.phone = payload.phone
          user.active = payload.status
          user.roleId = payload.id
      
          await user.save()
      
          return response.status(202).json({ message: 'success...' })
        } catch (error) {
          return response.status(400).json({
            message: 'unsuccessful...',
            errors: error.messages
          })
        }
      }
      
    public async deleteUser({ params, response }) {
        if(params.id == 1){
            return response.status(200).json({ message: 'this one is a no' });
        }
        
        const user = await User.find(params.id);
        if(!user){
            return response.status(404).json({ message: 'error 404 not found' })
        }

        await user.delete();
    
        return response.status(200).json({ message: 'deleted' });
    }

    public async getRole({response, auth}){

        const user = auth.user
        if(!user){
            return response.json({ role: false })
        }
        await user.load('role') // load the role relationships

        const role = user.role.Role

        return response.json({role: role})
    }

    
}
