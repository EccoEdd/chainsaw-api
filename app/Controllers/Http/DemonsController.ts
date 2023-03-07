// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Demon from "App/Models/Demon"
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class DemonsController {

    public async createDemon({ request, response }) {
        try {
            const newDemonSchema = schema.create({
                name: schema.string({ trim: true }, [
                    rules.required(),
                    rules.maxLength(45),
                    rules.unique({ table: 'demons', column: 'name' })
                ]),
                category: schema.string({ trim: true }, [
                    rules.required()
                ])
            })

            const payload = await request.validate({
            schema: newDemonSchema,
                messages: {
                    'name.required': 'You need a name for your demon',
                    'name.maxLength': 'The demon name should not exceed 45 characters',
                    'name.unique': 'This demon already exists',
                    'category.required': 'You need to classify this demon'
                }
            })

            const demon = new Demon()
            demon.name = payload.name
            demon.category = payload.category

            await demon.save()

            return response.status(201).json({ message: 'success...', data: demon })
        } catch (error) {
            return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }
    
    public async readDemons({ response }) {
        const demons = await Demon.all()
        return response.status(202).json({ message: 'all the data...', data: demons })
    }

    public async updateDemon({ request, response, params}) {
        const demon = await Demon.find(params.id)

        if (!demon) 
            return response.status(404).json({ message: 'error 404 not found' })
    
        const updateDemonSchema = schema.create({
            name: schema.string.optional({ trim: true }, [
                rules.maxLength(45),
                rules.unique({table: 'demons', column: 'name', whereNot: { id: params.id }})
            ]),
            category: schema.string.optional({ trim: true }, [
                rules.required()
            ])
        })
    
        try {
            const payload = await request.validate({
                schema: updateDemonSchema,
                messages: {
                    'name.maxLength': 'The demon name should not exceed 45 characters',
                    'name.unique': 'This demon already exists',
                    'category.required': 'You need to classify this demon'
                }
            })
    
            demon.name = payload.name ?? demon.name
            demon.category = payload.category ?? demon.category
            await demon.save()
    
            return response.status(202).json({ message: 'success...', oldData: demon, newData: payload })
        } catch (error) {
            return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }

    public async deleteDemon({ params, response }) {
        const demon = await Demon.find(params.id);
    
        if (!demon) 
            return response.status(404).json({ message: 'error 404 not found' });
    
        await demon.delete();
        return response.status(202).json({ message: 'Data deleted', data: demon });
    }    
}
