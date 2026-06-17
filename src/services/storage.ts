import * as SecureStore from 'expo-secure-store';

const PREFIX = 'vt_';

export async function secureGet(key: string): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(PREFIX + key);
  } catch {
    return null;
  }
}

export async function secureSet(key: string, value: string | null | undefined): Promise<void> {
  if (value == null) return;
  await SecureStore.setItemAsync(PREFIX + key, value);
}

export async function secureDelete(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(PREFIX + key);
}
