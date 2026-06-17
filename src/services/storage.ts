import * as SecureStore from 'expo-secure-store';

const PREFIX = 'vt_';

export async function secureGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PREFIX + key);
  } catch {
    return null;
  }
}

export async function secureSet(key: string, value: unknown): Promise<void> {
  if (value == null) return;
  const str = typeof value === 'string' ? value : JSON.stringify(value);
  await SecureStore.setItemAsync(PREFIX + key, str);
}

export async function secureDelete(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(PREFIX + key);
}
