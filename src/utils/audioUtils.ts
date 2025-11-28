import { Audio } from "expo-av";

/**
 * Solicita permissões de áudio
 * @returns {Promise<boolean>} True se permissão concedida
 */
export const requestAudioPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== "granted") {
      alert(
        "Permissão de microfone negada. Habilite nas configurações do app."
      );
      return false;
    }
    return true;
  } catch (error) {
    console.error("Erro ao solicitar permissão:", error);
    return false;
  }
};

/**
 * Configurações de gravação de áudio
 */
export const getRecordingOptions = () => {
  return {
    android: {
      extension: ".m4a",
      outputFormat: Audio.AndroidOutputFormat.MPEG_4,
      audioEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: "audio/webm",
      bitsPerSecond: 128000,
    },
  };
};

/**
 * Formata duração em segundos para mm:ss
 * @param {number} seconds - Segundos
 * @returns {string} Tempo formatado
 */
export const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
