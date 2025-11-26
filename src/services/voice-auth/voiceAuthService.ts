import axios from "axios";
import {
  API_BASE_URL,
  API_ENDPOINTS,
  API_TIMEOUT,
} from "../../config/voiceApi";

// Interfaces
interface VoiceAuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  phrase?: string;
}

interface AudioFile {
  uri: string;
  type?: string;
  name?: string;
}

interface ChallengeResponse {
  phrase: string;
}

interface EnrollResponse {
  success: boolean;
  message: string;
  user_id: string;
}

interface VerifyResponse {
  authenticated: boolean;
  similarity: number;
  user_id: string;
  message?: string;
  threshold?: number;
}

interface HealthResponse {
  status: string;
  message?: string;
}

// Criar instância do axios com configurações padrão
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Testa a conexão com a API
 * @returns {Promise<VoiceAuthResponse<HealthResponse>>} Status da API
 */
export const checkHealth = async (): Promise<
  VoiceAuthResponse<HealthResponse>
> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.HEALTH);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Erro ao conectar com a API",
    };
  }
};

/**
 * Obtém uma frase de desafio
 * @returns {Promise<VoiceAuthResponse<ChallengeResponse>>} Frase para o usuário pronunciar
 */
export const getChallengePhrase = async (): Promise<
  VoiceAuthResponse<ChallengeResponse>
> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.CHALLENGE);
    return {
      success: true,
      data: {
        phrase: response.data.phrase,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: (error as Error).message || "Erro ao obter frase de desafio",
    };
  }
};

/**
 * Cadastra a voz do usuário (Enrollment)
 * @param {string} userId - ID único do usuário
 * @param {string} phraseExpected - Frase que o usuário pronunciou
 * @param {AudioFile} audioFile - Arquivo de áudio {uri, type, name}
 * @returns {Promise<VoiceAuthResponse<EnrollResponse>>} Resultado do cadastro
 */
export const enrollVoice = async (
  userId: string,
  phraseExpected: string,
  audioFile: AudioFile
): Promise<VoiceAuthResponse<EnrollResponse>> => {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("phrase_expected", phraseExpected);
    (formData as any).append("audio_file", {
      uri: audioFile.uri,
      type: audioFile.type || "audio/wav",
      name: audioFile.name || "recording.wav",
    });

    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.ENROLL}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: API_TIMEOUT,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "❌ Erro no enrollment:",
      error.response?.data || error.message
    );

    // Extrair mensagem de erro da resposta
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Erro ao cadastrar voz";

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Verifica a identidade do usuário por voz
 * @param {string} userId - ID do usuário a ser verificado
 * @param {string} phraseExpected - Frase que o usuário pronunciou
 * @param {AudioFile} audioFile - Arquivo de áudio {uri, type, name}
 * @returns {Promise<VoiceAuthResponse<VerifyResponse>>} Resultado da verificação
 */
export const verifyVoice = async (
  userId: string,
  phraseExpected: string,
  audioFile: AudioFile
): Promise<VoiceAuthResponse<VerifyResponse>> => {
  try {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("phrase_expected", phraseExpected);
    (formData as any).append("audio_file", {
      uri: audioFile.uri,
      type: audioFile.type || "audio/wav",
      name: audioFile.name || "recording.wav",
    });

    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.VERIFY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: API_TIMEOUT,
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error(
      "❌ Erro na verificação:",
      error.response?.data || error.message
    );

    // Extrair mensagem de erro da resposta
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Erro ao verificar voz";

    return {
      success: false,
      error: errorMessage,
    };
  }
};
