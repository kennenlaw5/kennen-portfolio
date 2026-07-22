export type AppConfig = {
    phone: string
    email: string
    linkedin_url: string
    github_url: string
    city: string
    state_abbreviation: string
}
 
declare global {
    interface Window {
        APP_CONFIG: AppConfig
    }
}
export {}
