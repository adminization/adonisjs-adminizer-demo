import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.updateOrCreateMany('slug', [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'News and articles about software, hardware, and the tech industry.',
      },
      {
        name: 'Travel',
        slug: 'travel',
        description: 'Guides, tips, and stories from destinations around the world.',
      },
      {
        name: 'Food',
        slug: 'food',
        description: 'Recipes, restaurant reviews, and culinary inspiration.',
      },
      {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Thoughts on health, productivity, and everyday living.',
      },
    ])
  }
}
