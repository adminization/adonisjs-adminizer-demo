import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Article from '#models/article'
import User from '#models/user'
import Category from '#models/category'
import Tag from '#models/tag'

export default class extends BaseSeeder {
  async run() {
    const alice = await User.findByOrFail('email', 'alice@example.com')
    const bob = await User.findByOrFail('email', 'bob@example.com')

    const technology = await Category.findByOrFail('slug', 'technology')
    const travel = await Category.findByOrFail('slug', 'travel')
    const food = await Category.findByOrFail('slug', 'food')
    const lifestyle = await Category.findByOrFail('slug', 'lifestyle')

    const tags = {
      javascript: await Tag.findByOrFail('slug', 'javascript'),
      adonisjs: await Tag.findByOrFail('slug', 'adonisjs'),
      tutorial: await Tag.findByOrFail('slug', 'tutorial'),
      opinion: await Tag.findByOrFail('slug', 'opinion'),
      beginner: await Tag.findByOrFail('slug', 'beginner'),
    }

    const articles = [
      {
        title: 'Getting Started with AdonisJS',
        slug: 'getting-started-with-adonisjs',
        content:
          '<p>AdonisJS is a fully featured Node.js framework that favors convention over configuration. In this tutorial we walk through creating your first project, wiring up a database, and building your first route.</p>',
        coverImage: 'https://picsum.photos/seed/adonisjs/800/400',
        authorId: alice.id,
        categoryId: technology.id,
        publishedAt: DateTime.now().minus({ days: 10 }),
        tagSlugs: ['adonisjs', 'javascript', 'tutorial', 'beginner'],
      },
      {
        title: 'Why I Switched to TypeScript',
        slug: 'why-i-switched-to-typescript',
        content:
          '<p>After years of writing plain JavaScript, static types changed the way I think about refactoring and long-term maintenance. Here is what convinced me.</p>',
        coverImage: 'https://picsum.photos/seed/typescript/800/400',
        authorId: bob.id,
        categoryId: technology.id,
        publishedAt: DateTime.now().minus({ days: 7 }),
        tagSlugs: ['javascript', 'opinion'],
      },
      {
        title: 'A Weekend in Lisbon',
        slug: 'a-weekend-in-lisbon',
        content:
          '<p>Cobblestone streets, pastel de nata, and the smell of the Atlantic. Here is a two-day itinerary for exploring Lisbon on a budget.</p>',
        coverImage: 'https://picsum.photos/seed/lisbon/800/400',
        authorId: alice.id,
        categoryId: travel.id,
        publishedAt: DateTime.now().minus({ days: 5 }),
        tagSlugs: ['opinion'],
      },
      {
        title: 'Five Pasta Recipes for Busy Weeknights',
        slug: 'five-pasta-recipes-for-busy-weeknights',
        content:
          '<p>Quick, comforting, and mostly pantry staples. These five pasta recipes come together in under thirty minutes each.</p>',
        coverImage: 'https://picsum.photos/seed/pasta/800/400',
        authorId: bob.id,
        categoryId: food.id,
        publishedAt: DateTime.now().minus({ days: 3 }),
        tagSlugs: ['beginner'],
      },
      {
        title: 'Building a Simple Sleep Routine',
        slug: 'building-a-simple-sleep-routine',
        content:
          '<p>Small, consistent habits made the biggest difference to my sleep quality. Here is the routine that finally worked for me.</p>',
        coverImage: 'https://picsum.photos/seed/sleep/800/400',
        authorId: alice.id,
        categoryId: lifestyle.id,
        publishedAt: DateTime.now().minus({ days: 1 }),
        tagSlugs: ['opinion'],
      },
      {
        title: 'Draft: Notes on a New Framework',
        slug: 'draft-notes-on-a-new-framework',
        content: '<p>Unfinished thoughts, not ready for publishing yet.</p>',
        coverImage: null,
        authorId: bob.id,
        categoryId: technology.id,
        publishedAt: null,
        tagSlugs: ['javascript'],
      },
    ]

    for (const { tagSlugs, ...data } of articles) {
      const article = await Article.updateOrCreate({ slug: data.slug }, data)
      await article.related('tags').sync(tagSlugs.map((slug) => tags[slug as keyof typeof tags].id))
    }
  }
}
