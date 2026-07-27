import { AdminpanelConfig } from "adminizer";
const routePrefix = 'admin';

export const adminConfig: AdminpanelConfig = {
    list: {
        defaultPageSize: 5
    },
    filters: {
        enabled: true
    },
    system: {
        defaultORM: 'lucid',
        // internalModelAccess: {
        //     "test-catalog": ["TestCatalog", 'Category']
        // }
    },
    mediamanager: {
        fileStoragePath: '.tmp/public',
        allowMIME: ['image/*', 'application/*', 'text/*', 'video/*'],
        maxByteSize: 1024 * 1024 * 2, // 2 Mb
        imageSizes: {
            lg: {
                width: 750,
                height: 750
            },
            sm: {
                width: 350,
                height: 350
            }
        },
    },
    notifications: {
        enabled: true,
        enableGeneral: true,
        initTab: 'general',
    },
    history: {
        enabled: true,
        adapter: "default",
        // excludeModels: ["TestCatalog"]
    },
    cors: {
        enabled: false,
        origin: 'http://localhost:3000',
        path: 'api/*'
    },
    aiAssistant: {
        enabled: false,
        defaultModel: 'openai-data',
        models: ['openai-data', 'dummy'],
    },
    routePrefix: routePrefix,
    auth: {
        enable: true
    },
    registration: {
        enable: true,
        defaultUserGroup: "guest",
        confirmationRequired: false
    },
    dashboard: true,
    navbar: {
        additionalLinks: [
            {
                id: '5',
                type: "self",
                link: `${routePrefix}/catalog/test-catalog`,
                title: 'Test Catalog',
                icon: 'bug_report'
            }
        ]
    },
    sections: [
        {
            id: "0",
            title: 'Website 1',
            link: '#',
            type: 'self',
            icon: 'circle',
            subItems: [
                {
                    id: "0",
                    title: 'Sub 1',
                    type: 'blank',
                    link: 'https://example.com',
                    icon: 'language'
                },
                {
                    id: "1",
                    title: 'Sub 2',
                    link: 'https://google.com',
                    type: 'blank',
                    icon: 'share'
                },
                {
                    id: "3",
                    title: 'Sub 4',
                    link: 'https://google.com',
                    type: 'blank',
                    icon: 'insert_link'
                }
            ]
        },
        {
            id: "1",
            title: 'Website 2 Website 2 Website 2',
            link: 'https://example.com',
            type: 'blank',
            icon: 'insert_link'
        },
        {
            id: "2",
            title: 'Website 3',
            type: 'blank',
            link: 'https://example.com',
            icon: 'share'
        },
        {
            id: "3",
            title: 'Website 1',
            type: 'blank',
            link: 'https://example.com',
            icon: 'language'
        },
        {
            id: "4",
            title: 'Website 2 Website 2 Website 2',
            type: 'blank',
            link: 'https://example.com',
            icon: 'insert_link'
        },
    ],
    brand: {
        link: {
            id: "0",
            type: 'blank',
            title: 'Demo adminpanel',
            link: 'https://example.com',
        }
    },
    welcome: {
        title: 'Demo adminpanel project',
        text: 'restaurant and delivery food solution www.example.com'
    },
    administrator: {
        login: process.env.ADMIN_LOGIN === undefined ? 'admin' : process.env.ADMIN_LOGIN,
        password: process.env.ADMIN_PASS === undefined ? '45345345FF38' : process.env.ADMIN_PASS
    },
    translation: {
        locales: ['en', 'ru', 'de', 'ua'],
        directory: 'fixture/locales', // relative path to translations directory
        // missingTranslationDirectory: 'fixture/locales_missing',
        defaultLocale: 'en'
    },
    models: {},
    //@ts-ignore
    generator: {},
    showVersion: {
        link: 'https://docs.adminizer.org',
        hint: 'Adminizer documentation',
        // text is set dynamically in fixture/index.ts (startup time)
    }
}
