import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tag from '#models/tag'

export default class extends BaseSeeder {
  async run() {
    await Tag.updateOrCreateMany('slug', [
      { name: 'JavaScript', slug: 'javascript', description: 'Articles about JavaScript.' },
      { name: 'AdonisJS', slug: 'adonisjs', description: 'Articles about the AdonisJS framework.' },
      { name: 'Tutorial', slug: 'tutorial', description: 'Step-by-step guides and tutorials.' },
      { name: 'Opinion', slug: 'opinion', description: 'Opinion pieces and editorials.' },
      { name: 'Beginner', slug: 'beginner', description: 'Content aimed at beginners.' },
    ])
  }
}
