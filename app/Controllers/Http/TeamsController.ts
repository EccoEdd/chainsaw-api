// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Team from 'App/Models/Team';
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class TeamsController {

    public async createTeam({ request, response } ) {
        try {
        const newTeamSchema = schema.create({
            name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(45),
            rules.unique({ table: 'teams', column: 'name' })
            ]),
            id: schema.number([
            rules.required(),
            rules.exists({ table: 'branches', column: 'id' })
            ])
        })

        const payload = await request.validate({
            schema: newTeamSchema,
            messages: {
            'name.required': 'You need a name for your team',
            'name.maxLength': 'You only have 45 characters long',
            'name.unique': 'This team already exists',
            'id.required': 'You need a branch to link your team',
            'id.exists': 'The branch must exists'
            }
        })

        const team = new Team();
        team.name = payload.name;
        team.branchId = payload.id;
        await team.save();

        return response.status(201).json({ message: 'success...', data: team })
        } catch (error) {
        return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }

    public async readTeams({ response }) {
        const teams = await Team.query().preload('branch')
        return response.status(202).json({ message: 'all the data...', data: teams })
    }
    
    public async updateTeam( { request, response, params } ){
        const team = await Team.find(params.id)
        if(!team)
            return response.status(404).json({ message: 'error 404 not found' });

        const updateTeamSchema = schema.create({
        name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(45),
            rules.unique({ table: 'teams', column: 'name', whereNot: { id: params.id } })
        ]),
        status: schema.boolean([
            rules.required()
        ]),
        branchId: schema.number([
            rules.required(),
            rules.exists({ table: 'branches', column: 'id' })
        ]),
        });

        try {
        const payload = await request.validate({
            schema: updateTeamSchema,
            messages: {
            'name.maxLength': 'You only have 45 characters long',
            'name.unique': 'This name is already being occupied',
            'name.required': 'You need a name for your team',
            'status.required': 'You need to set this one',
            'status.boolean': 'It has to be True or False',
            'branchId.required': 'You need a branch to link your team',
            'branchId.exists': 'The branch must exists'
            }
        });

        const oldTeam = team.toJSON()
        team.name = payload.name
        team.status = payload.status
        team.branchId = payload.branchId
        await team.save()

        return response.status(202).json({ message: 'success...', oldData: oldTeam, newData: team })
        } catch (error) {
        return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }

    public async deleteTeam({ response, params }) {
        const team = await Team.find(params.id)
      
        if (!team)
          return response.status(404).json({ message: 'error 404 not found' })

        await team.delete();
        return response.status(202).json({ message: 'Data deleted', data: team })
    }
      
}
