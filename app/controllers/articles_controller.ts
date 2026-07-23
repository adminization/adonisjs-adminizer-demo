import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import Category from '#models/category'
import Tag from '#models/tag'

export default class ArticlesController {
  /**
   * Display a list of published articles
   */
  async index({ view }: HttpContext) {
    const articles = await Article.query()
      .whereNotNull('published_at')
      .preload('author')
      .preload('category')
      .preload('tags')
      .orderBy('published_at', 'desc')

    const categories = await Category.query().orderBy('name', 'asc')
    const tags = await Tag.query().orderBy('name', 'asc')

    return view.render('pages/articles/index', { articles, categories, tags })
  }

  /**
   * Show a single published article
   */
  async show({ params, view }: HttpContext) {
    const article = await Article.query()
      .where('slug', params.slug)
      .whereNotNull('published_at')
      .preload('author')
      .preload('category')
      .preload('tags')
      .firstOrFail()

    return view.render('pages/articles/show', { article })
  }

  /**
   * List published articles for a given category
   */
  async byCategory({ params, view }: HttpContext) {
    const category = await Category.findByOrFail('slug', params.slug)
    const articles = await Article.query()
      .where('category_id', category.id)
      .whereNotNull('published_at')
      .preload('author')
      .preload('category')
      .preload('tags')
      .orderBy('published_at', 'desc')

    return view.render('pages/articles/index', {
      articles,
      category,
      categories: await Category.query().orderBy('name', 'asc'),
      tags: await Tag.query().orderBy('name', 'asc'),
    })
  }

  /**
   * List published articles for a given tag
   */
  async byTag({ params, view }: HttpContext) {
    const tag = await Tag.findByOrFail('slug', params.slug)
    const articles = await Article.query()
      .whereNotNull('published_at')
      .whereHas('tags', (query) => query.where('tags.id', tag.id))
      .preload('author')
      .preload('category')
      .preload('tags')
      .orderBy('published_at', 'desc')

    return view.render('pages/articles/index', {
      articles,
      tag,
      categories: await Category.query().orderBy('name', 'asc'),
      tags: await Tag.query().orderBy('name', 'asc'),
    })
  }
}
