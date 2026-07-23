import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreateMany('email', [
      {
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        password: 'password123',
      },
      {
        fullName: 'Bob Smith',
        email: 'bob@example.com',
        password: 'password123',
      },
    ])
  }
}
