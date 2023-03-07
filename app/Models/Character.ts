import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'

export default class Character extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public l_name: string

  @column()
  public type: string

  @column()
  public alive: boolean

  @column()
  public age: number

  @column()
  public team_id: number
  
  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
