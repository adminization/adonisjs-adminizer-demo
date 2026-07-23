import type { ApplicationService } from '@adonisjs/core/types'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { Adminizer } from 'adminizer'
import { LucidAdapter } from '#adminizer/lucid_adapter'
import adminizerConfig from '#adminizer/config'
import Article from '#models/article'
import Category from '#models/category'
import Tag from '#models/tag'
import AdminizerUser from '#models/adminizer/adminizer_user'
import AdminizerGroup from '#models/adminizer/adminizer_group'
import AdminizerFilter from '#models/adminizer/adminizer_filter'
import AdminizerFilterColumn from '#models/adminizer/adminizer_filter_column'
import AdminizerHistoryAction from '#models/adminizer/adminizer_history_action'
import AdminizerNotification from '#models/adminizer/adminizer_notification'
import AdminizerUserNotification from '#models/adminizer/adminizer_user_notification'

export default class AdminizerProvider {
  constructor(protected app: ApplicationService) {}

  async ready() {
    const adapter = await LucidAdapter.create(
      {
        AdminizerUser: {
          Model: AdminizerUser,
          overrides: {
            apiKey: { columnName: 'userApiKey' },
          },
        },
        AdminizerGroup: { Model: AdminizerGroup },
        AdminizerFilter: { Model: AdminizerFilter },
        AdminizerFilterColumn: { Model: AdminizerFilterColumn },
        AdminizerHistoryAction: { Model: AdminizerHistoryAction },
        AdminizerNotification: { Model: AdminizerNotification },
        AdminizerUserNotification: {
          Model: AdminizerUserNotification,
          overrides: {
            notificationId: {
              type: 'association',
              model: 'Notification',
              via: 'notificationId',
              sourceRelation: 'notification',
            },
          },
        },
        Article,
        Category,
        Tag,
      },
      {
        systemModels: {
          User: 'AdminizerUser',
          Group: 'AdminizerGroup',
          Filter: 'AdminizerFilter',
          FilterColumn: 'AdminizerFilterColumn',
          HistoryActions: 'AdminizerHistoryAction',
          Notification: 'AdminizerNotification',
          UserNotification: 'AdminizerUserNotification',
        },
      }
    )

    const adminizer = new Adminizer([adapter])
    await adminizer.init(adminizerConfig)

    const routePrefix = adminizerConfig.routePrefix
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
}
