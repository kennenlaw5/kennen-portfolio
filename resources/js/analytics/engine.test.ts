import {afterEach, describe, expect, it, vi} from 'vitest'
import {
    ANALYTICS_EVENT_NAMES,
    PROJECT_ANALYTICS_IDS,
    type TAnalyticsEvent,
} from 'JS/analytics/contracts'
import {
    ANALYTICS_PREFERENCE_KEY,
    createAnalyticsEngine,
} from 'JS/analytics/engine'

const validConfig = {
    enabled: true,
    measurement_id: 'G-TEST1234',
}

type TMemoryStorage = {
    storage: Pick<Storage, 'getItem' | 'setItem'>
    value: () => string | null
}

const createMemoryStorage = (initialValue: string | null): TMemoryStorage => {
    let storedValue = initialValue

    return {
        storage: {
            getItem: vi.fn(() => storedValue),
            setItem: vi.fn((_key: string, value: string) => {
                storedValue = value
            }),
        },
        value: () => storedValue,
    }
}

const createNavigator = (
    doNotTrack: string | null = null,
    globalPrivacyControl = false,
): Navigator => ({
    doNotTrack,
    globalPrivacyControl,
} as Navigator)

const dataLayerCommands = (): unknown[][] => (window.dataLayer ?? []).map(
    (command) => Array.from(command as ArrayLike<unknown>),
)

const lastDataLayerCommand = () => {
    const commands = dataLayerCommands()

    return commands[commands.length - 1]
}

afterEach(() => {
    document.getElementById('kennen-ga4-script')?.remove()
    delete window.dataLayer
    delete window.gtag
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
})

describe('analytics engine', () => {
    it.each([
        ['missing configuration', null, 'granted', null, false],
        ['disabled configuration', {enabled: false, measurement_id: 'G-TEST1234'}, 'granted', null, false],
        ['malformed configuration', {enabled: true, measurement_id: 'UA-1234'}, 'granted', null, false],
        ['missing preference', validConfig, null, null, false],
        ['denied preference', validConfig, 'denied', null, false],
        ['Do Not Track', validConfig, 'granted', '1', false],
        ['Global Privacy Control', validConfig, 'granted', null, true],
    ])('fails closed for %s', (
        _description,
        configuration,
        preference,
        doNotTrack,
        globalPrivacyControl,
    ) => {
        const memory = createMemoryStorage(preference)
        const engine = createAnalyticsEngine({
            configuration,
            storage: memory.storage,
            browserNavigator: createNavigator(doNotTrack, globalPrivacyControl),
        })

        expect(engine.initialize()).toBe(false)
        engine.trackEvent({
            name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
            parameters: {page_path: '/'},
        })

        expect(document.getElementById('kennen-ga4-script')).toBeNull()
        expect(window.dataLayer).toBeUndefined()
    })

    it('fails closed when preference storage throws', () => {
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: {
                getItem: vi.fn(() => {
                    throw new Error('Storage unavailable')
                }),
                setItem: vi.fn(),
            },
            browserNavigator: createNavigator(),
        })

        expect(() => engine.initialize()).not.toThrow()
        expect(engine.initialize()).toBe(false)
        expect(document.getElementById('kennen-ga4-script')).toBeNull()
        expect(window.dataLayer).toBeUndefined()
    })

    it('fails closed when local storage is unavailable', () => {
        vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
            throw new DOMException('Storage unavailable', 'SecurityError')
        })

        const createEngine = () => createAnalyticsEngine({
            browserNavigator: createNavigator(),
            configuration: validConfig,
        })

        expect(createEngine).not.toThrow()

        const engine = createEngine()
        expect(engine.initialize()).toBe(false)
        expect(document.getElementById('kennen-ga4-script')).toBeNull()
    })

    it('uses Basic Consent Mode v2 ordering before events', () => {
        const memory = createMemoryStorage('granted')
        const appendChild = document.head.appendChild.bind(document.head)
        let commandsWhenScriptLoaded: unknown[][] = []

        vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
            commandsWhenScriptLoaded = [...dataLayerCommands()]

            return appendChild(node)
        })

        const fetchMock = vi.fn()
        const sendBeaconMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        Object.defineProperty(navigator, 'sendBeacon', {
            configurable: true,
            value: sendBeaconMock,
        })

        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: memory.storage,
            browserNavigator: createNavigator(),
        })

        expect(engine.initialize()).toBe(true)
        expect(
            Object.prototype.toString.call(window.dataLayer?.[0]),
        ).toBe('[object Arguments]')

        engine.trackEvent({
            name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
            parameters: {page_path: '/experience'},
        })

        expect(commandsWhenScriptLoaded).toEqual([
            ['consent', 'default', {
                ad_personalization: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                analytics_storage: 'denied',
            }],
            ['consent', 'update', {analytics_storage: 'granted'}],
            ['js', expect.any(Date)],
            ['config', 'G-TEST1234', {send_page_view: false}],
        ])
        expect(lastDataLayerCommand()).toEqual([
            'event',
            'page_view',
            {page_path: '/experience'},
        ])
        expect(fetchMock).not.toHaveBeenCalled()
        expect(sendBeaconMock).not.toHaveBeenCalled()
    })

    it('deduplicates the loader and configuration sequence', () => {
        const memory = createMemoryStorage('granted')
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: memory.storage,
            browserNavigator: createNavigator(),
        })

        expect(engine.initialize()).toBe(true)
        expect(engine.initialize()).toBe(true)

        expect(document.querySelectorAll('#kennen-ga4-script')).toHaveLength(1)
        expect(dataLayerCommands()).toHaveLength(4)
        expect(dataLayerCommands().filter(([command]) => command === 'config')).toHaveLength(1)
    })

    it('denies consent and suppresses events after explicit revocation', () => {
        const memory = createMemoryStorage('granted')
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: memory.storage,
            browserNavigator: createNavigator(),
        })

        expect(engine.initialize()).toBe(true)
        expect(engine.setPreference('denied')).toBe(true)
        expect(memory.value()).toBe('denied')

        const commandCountAfterDenial = dataLayerCommands().length
        expect(lastDataLayerCommand()).toEqual([
            'consent',
            'update',
            {
                ad_personalization: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                analytics_storage: 'denied',
            },
        ])

        engine.trackEvent({
            name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
            parameters: {page_path: '/'},
        })

        expect(dataLayerCommands()).toHaveLength(commandCountAfterDenial)
    })

    it('honors a new browser override without overwriting a stored grant', () => {
        const memory = createMemoryStorage('granted')
        const browserNavigator = createNavigator()
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: memory.storage,
            browserNavigator,
        })

        expect(engine.initialize()).toBe(true)
        browserNavigator.globalPrivacyControl = true

        expect(engine.initialize()).toBe(false)
        expect(memory.value()).toBe('granted')

        const commandCountAfterOverride = dataLayerCommands().length
        expect(lastDataLayerCommand()?.[0]).toBe('consent')
        expect(engine.initialize()).toBe(false)
        expect(dataLayerCommands()).toHaveLength(commandCountAfterOverride)

        browserNavigator.globalPrivacyControl = false
        expect(engine.initialize()).toBe(true)
        expect(lastDataLayerCommand()).toEqual([
            'consent',
            'update',
            {analytics_storage: 'granted'},
        ])
        expect(document.querySelectorAll('#kennen-ga4-script')).toHaveLength(1)
        expect(dataLayerCommands().filter(([command]) => command === 'config')).toHaveLength(1)
    })

    it('does not activate when a grant cannot be persisted', () => {
        const storage = {
            getItem: vi.fn(() => null),
            setItem: vi.fn(() => {
                throw new Error('Storage unavailable')
            }),
        }
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage,
            browserNavigator: createNavigator(),
        })

        expect(engine.setPreference('granted')).toBe(false)
        engine.trackEvent({
            name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
            parameters: {page_path: '/'},
        })

        expect(document.getElementById('kennen-ga4-script')).toBeNull()
        expect(window.dataLayer).toBeUndefined()
    })

    it('revokes the current page even when denial cannot be persisted', () => {
        const storage = {
            getItem: vi.fn(() => 'granted'),
            setItem: vi.fn(() => {
                throw new Error('Storage unavailable')
            }),
        }
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage,
            browserNavigator: createNavigator(),
        })

        expect(engine.initialize()).toBe(true)
        expect(engine.setPreference('denied')).toBe(false)

        const commandCountAfterDenial = dataLayerCommands().length
        engine.trackEvent({
            name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
            parameters: {page_path: '/'},
        })

        expect(dataLayerCommands()).toHaveLength(commandCountAfterDenial)
        expect(lastDataLayerCommand()?.[1]).toBe('update')
    })

    it('queues each closed event shape through one adapter', () => {
        const memory = createMemoryStorage('granted')
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: memory.storage,
            browserNavigator: createNavigator(),
        })
        const events: TAnalyticsEvent[] = [
            {
                name: ANALYTICS_EVENT_NAMES.PAGE_VIEW,
                parameters: {page_path: '/games'},
            },
            {
                name: ANALYTICS_EVENT_NAMES.CONTACT_LINK_CLICKED,
                parameters: {contact_method: 'github'},
            },
            {
                name: ANALYTICS_EVENT_NAMES.PROJECT_LINK_CLICKED,
                parameters: {project_id: PROJECT_ANALYTICS_IDS.AKIDO_LABS},
            },
            {
                name: ANALYTICS_EVENT_NAMES.RESUME_DOWNLOAD_CLICKED,
                parameters: {placement: 'experience'},
            },
        ]

        events.forEach((event) => engine.trackEvent(event))

        expect(dataLayerCommands().slice(-4)).toEqual(events.map((event) => [
            'event',
            event.name,
            event.parameters,
        ]))
        expect(memory.storage.getItem).toHaveBeenCalledWith(ANALYTICS_PREFERENCE_KEY)
    })

    it('contains provider command failures as silent no-ops', () => {
        const memory = createMemoryStorage('granted')
        window.gtag = vi.fn(() => {
            throw new Error('Provider unavailable')
        })
        const engine = createAnalyticsEngine({
            configuration: validConfig,
            storage: memory.storage,
            browserNavigator: createNavigator(),
        })

        expect(() => engine.initialize()).not.toThrow()
        expect(engine.initialize()).toBe(false)
        expect(document.getElementById('kennen-ga4-script')).toBeNull()
    })
})
