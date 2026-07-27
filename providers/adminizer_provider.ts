import type { ApplicationService } from '@adonisjs/core/types'
import {LucidAdapter} from "../lib/lucid_adapter.js";
import {Adminizer} from "adminizer";
import {adminConfig} from "../lib/config.js";
import type { IncomingMessage, ServerResponse } from 'node:http'
import config from '@adonisjs/core/services/config'
import {AdminizerSystemConfig} from "../src/define_config.js";

export default class AdminizerProvider {

    constructor(protected app: ApplicationService) {}

    register() {

        console.log('[Adminizer] register')

    }

    async boot() {

        console.log('[Adminizer] boot')

    }

    async start() {

        console.log('[Adminizer] start')

    }

    async ready() {
        const adminizerSystemConfig = config.get<AdminizerSystemConfig>('adminizer')

        if (!adminizerSystemConfig) {
            console.warn(
                '[Adminizer] config/adminizer.ts not found, skipping initialization'
            )
            return
        }

        const adapter = await LucidAdapter.create(adminizerSystemConfig.models, {
            systemModels: adminizerSystemConfig.systemModels,
        })

        const adminizer = new Adminizer([adapter])
        await adminizer.init(adminConfig)

        const routePrefix = adminConfig.routePrefix
        const server = await this.app.container.make('server')
        const nodeServer = server.getNodeServer()
        if (!nodeServer) return

        const adminizerMiddleware = adminizer.getMiddleware()

        nodeServer.removeAllListeners('request')
        nodeServer.on('request', (req: IncomingMessage, res: ServerResponse) => {
            const url = req.url ?? ''
            if (url === routePrefix || url.startsWith(`${routePrefix}/`)) {
                adminizerMiddleware(req as any, res as any, () => {
                    if (!res.headersSent) {
                        res.statusCode = 404
                        res.end('Not found')
                    }
                })
                return
            }
            server.handle(req, res)
        })
    }

    async shutdown() {

        console.log('[Adminizer] shutdown')

    }

}
