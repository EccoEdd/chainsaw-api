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

Route.group(() => {
  Route.get('/demons/read', 'DemonsController.readDemons')
  Route.get('/characters/read', 'CharactersController.readCharacters')

  Route.group(() => {
    Route.put('/update/:id', 'DemonsController.updateDemon').where('id', /^[0-9]+$/)
    Route.delete('/delete/:id', 'DemonsController.deleteDemon').where('id', /^[0-9]+$/)

    Route.post('/create', 'DemonsController.createDemon')
  }).prefix('demons');

  Route.group(() => {
    Route.post('/create', 'BranchesController.createBranch')
    Route.get('/read', 'BranchesController.readBranches')
    Route.put('/update/:id', 'BranchesController.updateBranch').where('id', /^[0-9]+$/)
    Route.delete('/delete/:id', 'BranchesController.deleteBranch').where('id', /^[0-9]+$/)
  }).prefix('branches');

  Route.group(() => {
    Route.get('/read', 'TeamsController.readTeams')
    Route.post('/create', 'TeamsController.createTeam')
    Route.put('/update/:id', 'TeamsController.updateTeam').where('id', /^[0-9]+$/)
    Route.delete('/delete/:id', 'TeamsController.deleteTeam').where('id', /^[0-9]+$/)
  }).prefix('teams');

  Route.group(() => {
    Route.post('/create', 'CharactersController.createCharacter')
    Route.put('/update/:id', 'CharactersController.updateCharacter').where('id', /^[0-9]+$/)
    Route.delete('/delete/:id', 'CharactersController.deleteCharacter').where('id', /^[0-9]+$/)
  }).prefix('characters');
  
}).prefix('api/chainsaw');

Route.group(() => {

  Route.group(() => {
    Route.delete('logOut', 'UsersController.logout')
  }).middleware(['auth', 'active', 'roles:v'])

  Route.post('/logIn', 'UsersController.logIn')

}).prefix('api/user');