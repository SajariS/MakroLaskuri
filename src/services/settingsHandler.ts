import type { Settings } from "../interfaces/Settings"


const SETTINGS_KEY = 'settings'

const defaultSettings: Settings = {
    name: '',
    lang: 'fi'
}

export async function getSettings(): Promise<Settings> {
    const stored = localStorage.getItem(SETTINGS_KEY)
    if (!stored) return defaultSettings

    try {
        return JSON.parse(stored)
    }
    catch {
        return defaultSettings
    }
}

export async function setSettings(settings: Settings): Promise<void> {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
    }
    catch {
        throw new Error('Failed to save to localStorage')
    }
}

export function createDefaultSettings(): Settings {
    return defaultSettings
}