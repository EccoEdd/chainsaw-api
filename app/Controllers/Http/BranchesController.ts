// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Branch from "App/Models/Branch";
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BranchesController {
    public async createBranch({ request, response }) {
        try {
            const newBranchSchema = schema.create({
                name: schema.string({ trim: true }, [
                    rules.required(),
                    rules.maxLength(45),
                    rules.unique({ table: 'branches', column: 'name' })
                ]),
                location: schema.string({ trim: true }, [
                    rules.required(),
                    rules.unique({ table: 'branches', column: 'location' })
                ])
            })
    
            const payload = await request.validate({
                schema: newBranchSchema,
                messages: {
                    'name.required': 'You need a name for your branch',
                    'name.maxLength': 'You only have 45 characters long',
                    'name.unique': 'This branch already exists',
                    'location.required': 'You need a location for this branch',
                    'location.unique': 'You can\'t have two or more branches in the same spot'
                }
            })
    
            const branch = new Branch()
            branch.name = payload.name
            branch.location = payload.location
    
            await branch.save()
    
            return response.status(201).json({ message: 'success...', data: branch })
        } catch (error) {
            return response.status(400).json({ message: 'unsuccessful...', errors: error.messages })
        }
    }

    public async readBranches({ response }) {
        const branches = await Branch.all()
        return response.status(202).json({ message: 'all the data...', data: branches })
    }

    async updateBranch({ request, response, params }) {
        const branch = await Branch.find(params.id);
      
        if (!branch)
          return response.status(404).json({ message: 'error 404 not found' });
      
        const updateBranchSchema = schema.create({
          name: schema.string.optional({ trim: true }, [
            rules.maxLength(45),
            rules.unique({ table: 'branches', column: 'name', whereNot: { id: params.id } }),
          ]),
          location: schema.string.optional({ trim: true }, [
            rules.required(),
            rules.unique({ table: 'branches', column: 'location', whereNot: { id: params.id } }),
          ]),
        });
      
        try {
          const payload = await request.validate({
            schema: updateBranchSchema,
            messages: {
              'name.maxLength': 'You only have 45 characters long',
              'name.unique': 'This name is already being occupied',
              'name.required': 'You need a name for your branch',
              'location.required': 'You need a location for your branch',
              'location.unique': 'This location is already being occupied'
            }
          });
      
          branch.name = payload.name ?? branch.name;
          branch.location = payload.location ?? branch.location;
          await branch.save();
      
          return response.status(202).json({ message: 'success...', oldData: branch, newData: payload });
        } catch (error) {
          return response.status(400).json({ message: 'unsuccessful...', errors: error.messages });
        }
    }    

    public async deleteBranch({ params, response }) {
        const branch = await Branch.find(params.id);
    
        if (!branch) 
            return response.status(404).json({ message: 'error 404 not found' });
    
        await branch.delete();
        return response.status(202).json({ message: 'Data deleted', data: branch });
    }   
}
