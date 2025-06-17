import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getUserLocation } from './locationService';
import { UnidadeSugerida } from '../../types/unit';
import { isExpirado } from '../../utils/isExpirado';
import api from '../apiService';

const STORAGE_KEY = '@unidade_sugerida';
const VALIDADE_MINUTOS = 15;

export async function buscarOuCacheUnidadeProxima(): Promise<{ id: number; nome: string } | null> {
  try {
    const cache = await AsyncStorage.getItem(STORAGE_KEY);
    if (cache) {
      const unidadeSalva: UnidadeSugerida = JSON.parse(cache);
      if (!isExpirado(unidadeSalva.timestamp, VALIDADE_MINUTOS)) {
        return { id: unidadeSalva.id, nome: unidadeSalva.nome };
      }
    }

    const { latitude, longitude } = await getUserLocation();

    const response = await api.post('/unidade-proxima', {
      latitude,
      longitude,
    });

    if (response.data) {
      const unidade: UnidadeSugerida = {
        ...response.data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(unidade));
      return { id: unidade.id, nome: unidade.nome };
    }

    return null;
  } catch (err) {
    console.error('Erro ao buscar unidade próxima:', err);
    return null;
  }
}
