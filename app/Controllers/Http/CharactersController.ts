// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Character from "App/Models/Character";
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CharactersController {
    public async createCharacter({ request, response }) {
        try {

            const newCharacterSchema = schema.create({
                name: schema.string({ trim: true }, [
                    rules.required(),
                    rules.maxLength(15)
                ]),
                l_name: schema.string.optional({ trim: true }, [
                    rules.maxLength(15)
                ]),
                type: schema.string({ trim: true }, [
                    rules.required(),
                    rules.maxLength(20)
                ]),
                alive: schema.boolean.optional(),
                age: schema.number.optional(),
                id: schema.number([
                    rules.required(),
                    rules.exists({ table: 'teams', column: 'id' })
                ])
            })

            const payload = await request.validate({
                schema: newCharacterSchema,
                messages: {
                    'name.required': 'You need a name for your character',
                    'name.maxLength': 'You only have 15 characters long',
                    'l_name.maxLength': 'You only have 15 characters long',
                    'type.required': 'You need to specify the type',
                    'type.maxLength': 'You only have 20 characters long',
                    'alive.boolean': 'This needs to be true or false',
                    'id.required': 'You need to set the team no matter if it is bad or good',
                    'id.exists': 'It need to exists in the Teams table'
                }
            })
    
            const character = new Character();

            character.name = payload.name;
            character.l_name = payload.l_name;
            character.type = payload.type;
            character.age = payload.age;
            character.alive = payload.alive;
            character.team_id = payload.id;

            

            await character.save();
    
            return response.status(201).json({ message: 'success...', data: character })
        } catch (error) {
            return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }

    public async readCharacters({ response }) {
        const characters = await Character.query().preload('team')
        return response.status(202).json({ message: 'all the data...', data: characters })
    }

    public async updateCharacter({ request, response, params }) {
        const character = await Character.find(params.id)
        if (!character){
          return response.status(404).json({ message: 'error 404 not found' })
        }

        const updateCharacterSchema = schema.create({
          name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(15)
          ]),
          l_name: schema.string.optional({ trim: true }, [
            rules.maxLength(15)
          ]),
          type: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(20)
          ]),
          alive: schema.boolean(),
          age: schema.number.optional(),
          id: schema.number([
            rules.required(),
            rules.exists({ table: 'teams', column: 'id' })
          ]),
        })
      
        try {
          const payload = await request.validate({
            schema: updateCharacterSchema,
            messages: {
              'name.maxLength': 'You only have 15 characters long',
              'name.required': 'You need a name for your character',
              'l_name.maxLength': 'You only have 15 characters long',
              'type.required': 'You need to specify the type',
              'type.maxLength': 'You only have 20 characters long',
              'alive.boolean': 'This needs to be true or false',
              'id.required': 'You need to set the team no matter if it is bad or good',
              'id.exists': 'It needs to exist in the Teams table'
            }
          })
            
          character.name = payload.name
          character.l_name = payload.l_name
          character.type = payload.type
      
          if (payload.alive !== undefined){
            character.alive = payload.alive
          }
      
          character.age = payload.age
          character.team_id = payload.id
      
          await character.save()
      
          return response.status(202).json({ message: 'success...', newData: character })
        } catch (error) {
          return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }  

    public async deleteCharacter({ response, params }) {
        const character = await Character.find(params.id)
      
        if (!character) {
          return response.status(404).json({ message: 'error 404 not found' })
        }
      
        await character.delete();
        return response.status(202).json({ message: 'Data deleted', data: character });
    }  
}
