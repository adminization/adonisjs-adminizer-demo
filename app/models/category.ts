import { CategorySchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Article from '#models/article'

export default class Category extends CategorySchema {
  @hasMany(() => Article)
  declare articles: HasMany<typeof Article>
}
