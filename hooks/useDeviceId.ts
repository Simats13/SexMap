import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = '@device_id';

export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initDeviceId = async () => {
      try {
        let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
        
        if (!id) {
          id = Crypto.randomUUID();
          await AsyncStorage.setItem(DEVICE_ID_KEY, id);
        }
        
        setDeviceId(id);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du device ID:', error);
      } finally {
        setLoading(false);
      }
    };

    initDeviceId();
  }, []);

  return { deviceId, loading };
}; 