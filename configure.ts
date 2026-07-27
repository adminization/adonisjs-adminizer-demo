import type Configure from '@adonisjs/core/commands/configure'
import { stubsRoot } from './stubs/main.js'
import { readdir, access } from 'node:fs/promises'

export async function configure(command: Configure) {

    const codemods = await command.createCodemods()

    await codemods.updateRcFile((rcFile) => {
        rcFile.addProvider(
            'adonisjs-adminizer/provider',
            ['web']
        )
    })

    const migrationsDir = command.app.makePath('database/migrations')

    async function migrationExists(pattern: string): Promise<boolean> {
        try {
            const files = await readdir(migrationsDir)
            return files.some((file) => file.includes(pattern))
        } catch {
            return false
        }
    }

    async function fileExists(path: string): Promise<boolean> {
        try {
            await access(path)
            return true
        } catch {
            return false
        }
    }

    /**
     * Migrations (order matters — user_groups depends on users & groups via FK)
     */
    if (await migrationExists('create_adminizer_users')) {
        command.logger.warning('Migration "create_adminizer_users" already exists, skipping')
    } else {
        await codemods.makeUsingStub(stubsRoot, 'migrations/create_adminizer_users.stub', {})
    }

    if (await migrationExists('create_adminizer_groups')) {
        command.logger.warning('Migration "create_adminizer_groups" already exists, skipping')
    } else {
        await codemods.makeUsingStub(stubsRoot, 'migrations/create_adminizer_groups.stub', {})
    }

    if (await migrationExists('create_adminizer_user_groups')) {
        command.logger.warning('Migration "create_adminizer_user_groups" already exists, skipping')
    } else {
        await codemods.makeUsingStub(stubsRoot, 'migrations/create_adminizer_user_groups.stub', {})
    }

    /**
     * Models
     */
    const userModelPath = command.app.makePath('app/models/adminizer/adminizer_user.ts')
    if (await fileExists(userModelPath)) {
        command.logger.warning('Model "adminizer_user.ts" already exists, skipping')
    } else {
        await codemods.makeUsingStub(stubsRoot, 'models/adminizer_user.stub', {})
    }

    const groupModelPath = command.app.makePath('app/models/adminizer/adminizer_group.ts')
    if (await fileExists(groupModelPath)) {
        command.logger.warning('Model "adminizer_group.ts" already exists, skipping')
    } else {
        await codemods.makeUsingStub(stubsRoot, 'models/adminizer_group.stub', {})
    }

    /**
     * Config
     */
    const configPath = command.app.makePath('config/adminizer.ts')
    if (await fileExists(configPath)) {
        command.logger.warning('Config file "adminizer.ts" already exists, skipping')
    } else {
        await codemods.makeUsingStub(stubsRoot, 'config/adminizer.stub', {})
    }

    command.logger.info('Please run "node ace migration:run" to apply the migrations')

}
