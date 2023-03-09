// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Role from "App/Models/Role";
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class RolesController {
    public async getRoles({response}){
        const roles = await Role.all()
        return response.status(202).json({ message: 'all the data...', data: roles })
    }
    
    public async createRole({ request, response }) {
        try {
            const newRoleSchema = schema.create({
                role: schema.string({ trim: true }, [
                    rules.required(),
                    rules.maxLength(1),
                    rules.unique({ table: 'roles', column: 'role' })
                ]),
                description: schema.string({ trim: true }, [
                    rules.required(),
                    rules.maxLength(35),
                    rules.unique({ table: 'roles', column: 'description' })
                ])
            });
    
            const payload = await request.validate({
                schema: newRoleSchema,
                messages: {
                    'role.required': 'You need to provide a role',
                    'role.maxLength': 'The role should be maximum of 1 character',
                    'role.unique': 'This role already exists',
                    'description.required': 'You need to provide a description',
                    'description.maxLength': 'The description should be maximum of 35 characters',
                    'description.unique': 'This role description already exists'
                }
            });
    
            const role = new Role();
            role.role = payload.role;
            role.description = payload.description;
            await role.save();
    
            return response.status(201).json({ message: 'success...', data: role.toJSON() });
        } catch (error) {
            return response.status(400).json({ message: 'unsuccessful...', errors: error.messages });
        }
    }
    
    public async updateRole({ request, response, params: { id } }) {
        if (id == 1 || id == 2) {
            return response.status(200).json({ message: 'This one is a no' });
        }
    
        const role = await Role.find(id);
        if (!role) {
            return response.status(404).json({ message: 'Error 404: not found' });
        }
    
        const updatedRoleSchema = schema.create({
            role: schema.string({ trim: true }, [
                rules.required(),
                rules.maxLength(1),
                rules.unique({ table: 'roles', column: 'role', whereNot: { id: id }})
            ]),
            description: schema.string({ trim: true }, [
                rules.required(),
                rules.maxLength(35),
                rules.unique({ table: 'roles', column: 'description', whereNot: { id: id }})
            ])
        });
    
        const payload = await request.validate({
            schema: updatedRoleSchema,
            messages: {
                'role.required': 'You need to provide a role',
                'role.maxLength': 'The role should be maximum of 1 character',
                'role.unique': 'This role already exists',
                'description.required': 'You need to provide a description',
                'description.maxLength': 'The description should be maximum of 35 characters',
                'description.unique': 'This role description already exists'
            }
        });
    
        role.role = payload.role;
        role.description = payload.description;
        await role.save();
    
        return response.status(202).json({ message: 'success...' });
    }
    
    public async deleteRole({ params, response }) {

        if (params.id == 1 || params.id == 2) {
            return response.status(400).json({ message: 'forbidden' });
        }
    
        const role = await Role.find(params.id);
    
        if (!role) {
            return response.status(404).json({ message: 'error 404 not found' });
        }
    
        await role.delete();
    
        return response.status(200).json({ message: 'deleted' });
    }    
    
}
