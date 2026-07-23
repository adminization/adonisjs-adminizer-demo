# Установка и настройка Adminizer в этом проекте

Этот документ описывает, как в блог на AdonisJS 7 (Lucid/SQLite) была добавлена админ-панель [Adminizer](https://github.com/adminization/adminizer), и как расширять эту интеграцию дальше.

## Почему потребовался кастомный адаптер

Adminizer из коробки поддерживает только адаптеры Sequelize (основной) и TypeORM (экспериментальный). Этот проект использует Lucid ORM, поэтому был написан собственный адаптер `LucidAdapter`, реализующий контракт `AbstractAdapter`/`AbstractModel` из пакета `adminizer` поверх Lucid.

Системные модели Adminizer (`User`, `Group`, `Filter`, `FilterColumn`, `HistoryActions`, `Notification`, `UserNotification` — внутренняя бухгалтерия панели: админ-аккаунты, группы прав, сохранённые фильтры, история изменений, уведомления) вынесены в отдельные таблицы `adminizer_*` и отдельные Lucid-модели. Это сделано специально, чтобы **не трогать** таблицу `users` и логику аутентификации блога (`withAuthFinder`, email/password) — у Adminizer полностью свой набор аккаунтов и свой вход по `/adminizer`.

Модели `Article`, `Category`, `Tag` зарегистрированы в Adminizer как обычные "прикладные" модели — панель управляет реальными таблицами блога через тот же `LucidAdapter`.

## Установка пакета

```bash
npm install adminizer@5.0.0-build.5
```

Использовалась конкретная версия с npm-тега `alpha` (`5.0.0-build.5`), а не локальный исходник из `/prj/adminizer` (тот подключён в проект отдельным симлинком `adminizer/` и в сборку/typecheck не входит — см. `exclude` в `tsconfig.json`).

### Пакетные баги этой сборки adminizer (важно!)

Версия `5.0.0-build.5` содержит две проблемы, которые пришлось обойти:

1. **Во всех `.d.ts` файлах пакета относительные `import`/`export` не имеют расширения `.js`** (например, `from "../interfaces/adminpanelConfig"` вместо `.../adminpanelConfig.js`). Это ломает резолвинг типов TypeScript при `moduleResolution: NodeNext` (рантайм `.js`-файлы в порядке, ломаются только типы). Исправлено кодмодом, который добавляет `.js` во все такие спецификаторы, и зафиксировано патчем через [`patch-package`](https://www.npmjs.com/package/patch-package):
   - патч лежит в `patches/adminizer+5.0.0-build.5.patch`;
   - скрипт `"postinstall": "patch-package"` в `package.json` переприменяет патч автоматически после каждого `npm install`.
   - Если версия adminizer будет обновлена, патч, скорее всего, перестанет накладываться (сместятся строки) — нужно будет пересоздать его тем же способом (пройтись по всем `.d.ts` в `node_modules/adminizer` и дописать `.js` к относительным путям без расширения, затем `npx patch-package adminizer`).
2. **Корневой `index.js`/`index.d.ts` безусловно реэкспортирует адаптеры Sequelize и TypeORM.** Из-за этого любой импорт из `adminizer` требует, чтобы пакеты `sequelize` и `typeorm` физически стояли в `node_modules`, даже если используется только Lucid-адаптер. Поэтому оба пакета добавлены в зависимости проекта — они не используются в рантайме, а нужны только чтобы резолвился импорт.

## Переменные окружения

В `.env` / `.env.example` добавлены:

```env
JWT_SECRET=<случайная строка>
AP_PASSWORD_SALT=<случайная строка>
```

- `JWT_SECRET` — подписывает cookie `adminizer_jwt` (сессия админки). Если не задать — Adminizer сгенерирует случайный при каждом старте, и все сессии будут сбрасываться при перезапуске сервера.
- `AP_PASSWORD_SALT` — соль, с которой хэшируются пароли админ-пользователей (`login + password + AP_PASSWORD_SALT`). Должна быть стабильной, иначе после смены значения никто не сможет залогиниться существующими паролями.

## Структура файлов

```text
app/adminizer/
├── config.ts              # AdminpanelConfig — routePrefix, auth, модели в панели
└── lucid_adapter.ts        # LucidAdapter + LucidModelResource — мост Lucid → Adminizer

app/models/adminizer/
├── adminizer_user.ts
├── adminizer_group.ts
├── adminizer_filter.ts
├── adminizer_filter_column.ts
├── adminizer_history_action.ts
├── adminizer_notification.ts
└── adminizer_user_notification.ts

database/migrations/
├── ..._create_adminizer_groups_table.ts
├── ..._create_adminizer_users_table.ts
├── ..._create_adminizer_user_groups_table.ts
├── ..._create_adminizer_filters_table.ts
├── ..._create_adminizer_filter_columns_table.ts
├── ..._create_adminizer_history_actions_table.ts
├── ..._create_adminizer_notifications_table.ts
└── ..._create_adminizer_user_notifications_table.ts

providers/adminizer_provider.ts   # инициализация Adminizer + монтирование в HTTP-сервер
```

### `app/adminizer/lucid_adapter.ts`

Ключевые части:

- `buildLucidAttributes(Model, overrides)` — асинхронно вычисляет для Lucid-модели набор атрибутов в формате Adminizer (`type`, `required`, `columnName`, ассоциации). Типы полей определяются через `db.connection(...).columnsInfo(table)` (реальная информация о колонках из SQLite), а не декларируются вручную, как в Sequelize.
  - Результат кэшируется в module-level `WeakMap` (`attributesCache`, `relationAliasCache`), потому что `AbstractModel`/`AbstractAdapter` требуют **синхронного** конструктора (`new adapter.Model(modelName, model)` вызывает сам Adminizer), а получение информации о колонках — асинхронная операция. Поэтому весь расчёт атрибутов делается заранее в `LucidAdapter.create(...)`, до создания самого адаптера.
- `overrides` — точечные патчи атрибутов, нужны для соответствия внутреннему контракту системных моделей Adminizer (`system/systemModelContracts.js` в самом пакете), который местами отличается от TypeScript-интерфейсов в `models/*.d.ts`. Два реальных случая в этом проекте:
  - `AdminizerUser.apiKey` должен репортить `columnName: "userApiKey"` (историческое требование контракта, не связано с реальным именем колонки в БД);
  - `AdminizerUserNotification.notificationId` должен репортиться как **ассоциация** (`type: "association"`), а не как обычное число — реализовано через `sourceRelation`, который говорit адаптеру, какое реальное имя Lucid-отношения (`notification`) использовать при `preload`.
- `LucidModelResource` — реализация `AbstractModel`: транслирует критерии Adminizer (`where` с `and/or/not` и операторами `eq/ne/gt/gte/lt/lte/contains/startsWith/endsWith/in/notIn/between/isNull/isNotNull`, `sort`, `limit/skip`, `populate`) в вызовы query builder'а Lucid, плюс CRUD (`_create/_find/_findOne/_update/_updateOne/_destroy/_destroyOne/_count`) с разбором ассоциаций (belongsTo пишется как FK, manyToMany — через `.sync()`).
- `LucidAdapter` — реализация `AbstractAdapter`, `Model = LucidModelResource`, хранит `Record<string, LucidModel>` моделей.

### `app/adminizer/config.ts`

`AdminpanelConfig`: `routePrefix: '/adminizer'`, `auth.enable: true`, `system.defaultORM: 'lucid'`, и `models` — только `Article`, `Category`, `Tag` (системные модели `User`/`Group`/... **не** перечисляются в `config.models` — они управляются встроенным UI Adminizer напрямую, добавление их в `config.models` не даёт эффекта: `validateSystemModels.js` явно пропускает конфиги с именами системных моделей).

### `providers/adminizer_provider.ts`

В хуке жизненного цикла `ready()` (не `boot()` — сервисы `@adonisjs/lucid/services/db` и `@adonisjs/core/services/server` заполняются только после `app.booted()`, то есть уже во время/после `ready`):

1. Собирает `LucidAdapter` со всеми моделями (системные `Adminizer*` + `Article/Category/Tag`) и биндингом `systemModels`, сопоставляющим канонические имена (`User`, `Group`, ...) с именами наших классов (`AdminizerUser`, `AdminizerGroup`, ...).
2. Создаёт `new Adminizer([adapter])`, вызывает `adminizer.init(config)`.
3. Получает сырой Node `http.Server` через `(await app.container.make('server')).getNodeServer()`, снимает единственный `request`-listener Adonis и ставит свой: запросы под `/adminizer` уходят в `adminizer.getMiddleware()`, всё остальное — в `server.handle(req, res)` (обычный роутинг Adonis).
   - Если `adminizer.getMiddleware()` не находит маршрут (Express вызывает `next()`), обязательно нужно самим ответить `404`, иначе запрос зависнет навсегда — Adonis о нём уже не узнает.

Такой подход **полностью обходит** middleware-стек Adonis (`shield`/CSRF, `session` и т.д.) для `/adminizer` — у Adminizer свои сессии, CSRF (`XSRF-TOKEN`/`X-XSRF-TOKEN`) и JWT-cookie (`adminizer_jwt`).

## Первый вход

Никакого сида администратора нет. При первом заходе на `/adminizer`, если в таблице `adminizer_users` нет ни одной записи с `is_administrator = true`, панель сама редиректит на `/adminizer/init_user` — форма создания первого администратора (логин/пароль). После этого — обычный логин на `/adminizer/model/User/login`.

## Как добавить новую модель в панель

1. Обычная Lucid-модель (уже существующая в проекте, например будущая `Comment`).
2. Импортировать её в `providers/adminizer_provider.ts` и добавить в объект моделей, передаваемый в `LucidAdapter.create({...})`, простым видом `Comment` (без `overrides` — они нужны только системным моделям).
3. Добавить секцию в `app/adminizer/config.ts` → `models.Comment: { title, model: 'Comment', titleField, list/add/edit/remove/view: true, ... }`.
4. Перезапустить сервер (`node ace serve`) — при следующем запросе к `/adminizer` модель появится в меню.

## Проверка после изменений

```bash
npm run typecheck
npm run lint
node ace serve
```

Затем открыть `http://localhost:3333/adminizer` в браузере — при первом запуске должна появиться форма `init_user`, а `/` (страницы блога) должны продолжать работать как раньше.
