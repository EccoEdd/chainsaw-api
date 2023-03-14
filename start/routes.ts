/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

//The order of the Middlewares alterates the final product beware!
//Normal Crud
Route.group(() => {

  Route.get('/demons/read', 'DemonsController.readDemons')
  Route.get('/characters/read', 'CharactersController.readCharacters')

  Route.group(() => {
    Route.put('/update/:id', 'DemonsController.updateDemon').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
    Route.delete('/delete/:id', 'DemonsController.deleteDemon').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
    Route.post('/create', 'DemonsController.createDemon')
  }).prefix('demons').middleware('roles:a,u');

  Route.group(() => {
    Route.post('/create', 'BranchesController.createBranch')
    Route.get('/read', 'BranchesController.readBranches')
    Route.put('/update/:id', 'BranchesController.updateBranch').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
    Route.delete('/delete/:id', 'BranchesController.deleteBranch').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
  }).prefix('branches').middleware('roles:a');

  Route.group(() => {
    Route.get('/read', 'TeamsController.readTeams')
    Route.post('/create', 'TeamsController.createTeam')
    Route.put('/update/:id', 'TeamsController.updateTeam').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
    Route.delete('/delete/:id', 'TeamsController.deleteTeam').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
  }).prefix('teams').middleware('roles:a');

  Route.group(() => {
    Route.post('/create', 'CharactersController.createCharacter')
    Route.put('/update/:id', 'CharactersController.updateCharacter').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
    Route.delete('/delete/:id', 'CharactersController.deleteCharacter').where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })
  }).prefix('characters').middleware('roles:a,u');
  
}).prefix('api/chainsaw').middleware(['auth', 'active']);

//Crud Roles
Route.group(() => {
  Route.get('get', 'RolesController.getRoles')
  Route.post('create', 'RolesController.createRole')
  Route.put('/update/:id', 'RolesController.updateRole').where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
  })
  Route.delete('/delete/:id', 'RolesController.deleteRole').where('id', {
    match: /^[0-9]+$/,
    cast: (id) => Number(id),
  })
}).prefix('api/roles').middleware(['auth', 'active', 'roles:a'])

//User Crud/Controller
Route.group(() => {

  Route.post('logIn', 'UsersController.logIn')
  Route.post('register', 'UsersController.register')

  Route.group(() => {
    Route.delete('logOut', 'UsersController.logout')
    Route.get('check', 'UsersController.roleCheck')

    Route.get('role',  'UsersController.getRole')

    Route.group(() => {
      Route.get('get', 'UsersController.checkUsers')
      Route.put('update/:id', 'UsersController.modifyUser').where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })
      Route.delete('delete/:id', 'UsersController.deleteUser').where('id', {
        match: /^[0-9]+$/,
        cast: (id) => Number(id),
      })
    }).middleware('roles:a')

  }).middleware(['auth', 'active'])


  //Signed middleware not found
  Route.get('link/:id', 'UsersController.link').as('link')
    .where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id),
    })

  Route.get('number/:id', 'UsersController.number').as('number')
    .where('id', {
      match: /^[0-9]+$/,
      cast: (id) => Number(id)
    })

}).prefix('api/user');

Route.get('viewPhone', 'NormalsController.viewCheck').as('viewPhone')