import type { AdminpanelConfig } from 'adminizer'

const config: AdminpanelConfig = {
  routePrefix: '/adminizer',
  auth: {
    enable: true,
    captcha: false,
  },
  system: {
    defaultORM: 'lucid',
  },
  registration: {
    enable: false,
    defaultUserGroup: 'Editors',
    confirmationRequired: false,
  },
  models: {
    Article: {
      title: 'Articles',
      model: 'Article',
      titleField: 'title',
      icon: 'article',
      list: true,
      add: true,
      edit: true,
      remove: true,
      view: true,
    },
    Category: {
      title: 'Categories',
      model: 'Category',
      titleField: 'name',
      icon: 'category',
      list: true,
      add: true,
      edit: true,
      remove: true,
      view: true,
    },
    Tag: {
      title: 'Tags',
      model: 'Tag',
      titleField: 'name',
      icon: 'label',
      list: true,
      add: true,
      edit: true,
      remove: true,
      view: true,
    },
  },
}

export default config
