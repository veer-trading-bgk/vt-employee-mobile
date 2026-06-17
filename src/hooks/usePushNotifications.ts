import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useEffect, useRef } from 'react';
import { API_URL } from '@/utils/constants';
import { secureGet } from '@/services/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const notifListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    registerForPush();

    notifListener.current = Notifications.addNotificationReceivedListener((n) => {
      console.log('Push received:', n.request.content.title);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (r) => console.log('Push tapped:', r.notification.request.content.title)
    );

    return () => {
      notifListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const registerForPush = async () => {
    if (!Device.isDevice) return;
    const { status: existing } = await Notifications.getPermissionsAsync();
    let final = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      final = status;
    }
    if (final !== 'granted') return;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const authToken = await secureGet('token');
    if (!authToken) return;

    await fetch(`${API_URL}/api/notifications/register-device`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ expoPushToken: tokenData.data }),
    }).catch(() => {});
  };

  const scheduleLocal = async (title: string, body: string, delaySecs = 1) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: delaySecs },
    });
  };

  return { scheduleLocal };
}
