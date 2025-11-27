// Service de stockage avec abstraction window.storage / localStorage / Capacitor Preferences

import { Preferences } from '@capacitor/preferences';

export interface StorageAdapter {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}

// Adaptateur pour Capacitor Preferences (priorité pour mobile)
class CapacitorStorageAdapter implements StorageAdapter {
    async get(key: string): Promise<string | null> {
        try {
            const { value } = await Preferences.get({ key });
            return value;
        } catch (error) {
            console.error('CapacitorStorage get error:', error);
            return null;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            await Preferences.set({ key, value });
        } catch (error) {
            console.error('CapacitorStorage set error:', error);
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await Preferences.remove({ key });
        } catch (error) {
            console.error('CapacitorStorage remove error:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            await Preferences.clear();
        } catch (error) {
            console.error('CapacitorStorage clear error:', error);
            throw error;
        }
    }
}

// Adaptateur pour window.storage (si disponible)
class WindowStorageAdapter implements StorageAdapter {
    async get(key: string): Promise<string | null> {
        try {
            const result = await (window as any).storage.get(key);
            return result?.value || null;
        } catch (error) {
            console.error('WindowStorage get error:', error);
            return null;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            await (window as any).storage.set(key, value);
        } catch (error) {
            console.error('WindowStorage set error:', error);
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            await (window as any).storage.remove(key);
        } catch (error) {
            console.error('WindowStorage remove error:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            await (window as any).storage.clear();
        } catch (error) {
            console.error('WindowStorage clear error:', error);
            throw error;
        }
    }
}

// Adaptateur pour localStorage (fallback)
class LocalStorageAdapter implements StorageAdapter {
    async get(key: string): Promise<string | null> {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.error('LocalStorage get error:', error);
            return null;
        }
    }

    async set(key: string, value: string): Promise<void> {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.error('LocalStorage set error:', error);
            throw error;
        }
    }

    async remove(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('LocalStorage remove error:', error);
            throw error;
        }
    }

    async clear(): Promise<void> {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('LocalStorage clear error:', error);
            throw error;
        }
    }
}

// Service de stockage principal
class StorageService {
    private adapter: StorageAdapter;

    constructor() {
        // Vérifier Capacitor en premier (pour mobile)
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
            console.log('Using Capacitor Preferences adapter');
            this.adapter = new CapacitorStorageAdapter();
        } else if (typeof window !== 'undefined' && (window as any).storage) {
            console.log('Using window.storage adapter');
            this.adapter = new WindowStorageAdapter();
        } else {
            console.log('Using localStorage adapter');
            this.adapter = new LocalStorageAdapter();
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const value = await this.adapter.get(key);
        if (!value) return null;
        try {
            return JSON.parse(value) as T;
        } catch {
            return value as T;
        }
    }

    async set<T>(key: string, value: T): Promise<void> {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        await this.adapter.set(key, stringValue);
    }

    async remove(key: string): Promise<void> {
        await this.adapter.remove(key);
    }

    async clear(): Promise<void> {
        await this.adapter.clear();
    }
}

// Instance singleton
export const storage = new StorageService();
