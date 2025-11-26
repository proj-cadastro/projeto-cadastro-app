import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Audio } from "expo-av";
import {
  getChallengePhrase,
  verifyVoice,
} from "../../services/voice-auth/voiceAuthService";
import {
  requestAudioPermissions,
  getRecordingOptions,
  formatDuration,
} from "../../utils/audioUtils";

interface VoiceRecognitionModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isDarkMode?: boolean;
  userName: string;
  userId: string;
}

const VoiceRecognitionModal: React.FC<VoiceRecognitionModalProps> = ({
  visible,
  onClose,
  onSuccess,
  isDarkMode = false,
  userName,
  userId,
}) => {
  // Estados do componente
  const [phrase, setPhrase] = useState<string>("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [autoStopTimer, setAutoStopTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pulseAnim] = useState(new Animated.Value(1));

  // Ref para tracking do recording
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  useEffect(() => {
    if (visible) {
      // Obter frase da API quando o modal abre
      getNewPhrase();
      setRecordingUri(null);
      setIsRecording(false);
      setRecordingTime(0);
    }

    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (autoStopTimer) {
        clearTimeout(autoStopTimer);
      }
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [visible]);

  useEffect(() => {
    if (isRecording) {
      // Animação de pulsação durante a gravação
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Função para obter nova frase da API
  const getNewPhrase = async () => {
    setIsLoading(true);
    const result = await getChallengePhrase();
    setIsLoading(false);

    if (result.success && result.data?.phrase) {
      setPhrase(result.data.phrase);
    } else {
      // Fallback para frase padrão se API falhar
      setPhrase("Confirmo minha presença.");
    }
  };

  // Função para iniciar gravação
  const startRecording = async () => {
    try {
      const hasPermission = await requestAudioPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão Negada",
          "Permissão de microfone é necessária para verificação por voz."
        );
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      const recordingOptions = getRecordingOptions();
      const { recording: newRecording } = await Audio.Recording.createAsync(
        recordingOptions
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingTime(0);

      // Atualizar refs
      recordingRef.current = newRecording;
      isRecordingRef.current = true;

      // Iniciar contador de tempo
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000) as NodeJS.Timeout;
      setTimerInterval(interval);

      // Timer automático para parar em 12 segundos
      const autoStop = setTimeout(async () => {
        if (recordingRef.current && isRecordingRef.current) {
          try {
            // Forçar parada da gravação
            setIsRecording(false);
            isRecordingRef.current = false;

            // Limpar timers
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }

            // Parar e obter URI
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();

            setRecordingUri(uri);
            setRecording(null);
            recordingRef.current = null;
          } catch (error) {
            // Forçar reset em caso de erro
            setIsRecording(false);
            isRecordingRef.current = false;
            setRecording(null);
            recordingRef.current = null;
            if (timerInterval) {
              clearInterval(timerInterval);
              setTimerInterval(null);
            }
          }
        }
      }, 12000) as NodeJS.Timeout;
      setAutoStopTimer(autoStop);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao iniciar gravação: " + (error as Error).message
      );
    }
  };

  // Função para parar gravação
  const stopRecording = async () => {
    if (!recording) return;

    try {
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }

      if (autoStopTimer) {
        clearTimeout(autoStopTimer);
        setAutoStopTimer(null);
      }

      setIsRecording(false);
      isRecordingRef.current = false;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecordingUri(uri);
      setRecording(null);
      recordingRef.current = null;
    } catch (error) {
      console.error("❌ Erro ao parar gravação:", error);
      Alert.alert(
        "Erro",
        "Falha ao parar gravação: " + (error as Error).message
      );
    }
  };

  // Função para verificar voz
  const handleConfirm = async () => {
    if (!recordingUri || !phrase) {
      Alert.alert("Erro", "Gravação ou frase não encontrada");
      return;
    }

    setIsLoading(true);

    try {
      const audioFile = {
        uri: recordingUri,
        type: "audio/wav",
        name: `voice_verification_${Date.now()}.wav`,
      };

      // Usar userId para verificação
      const result = await verifyVoice(userId, phrase, audioFile);
      setIsLoading(false);

      if (result.success && result.data) {
        // Verificar se a autenticação foi bem-sucedida
        if (result.data.authenticated) {
          Alert.alert(
            "Sucesso!",
            `Verificação por voz realizada com sucesso! Similaridade: ${(
              result.data.similarity * 100
            ).toFixed(1)}%`,
            [
              {
                text: "OK",
                onPress: onSuccess,
              },
            ]
          );
        } else {
          const similarity = result.data?.similarity
            ? (result.data.similarity * 100).toFixed(1)
            : "0.0";
          const message = result.data?.message || "Voz não reconhecida";
          const threshold = result.data?.threshold
            ? (result.data.threshold * 100).toFixed(1)
            : "75.0";

          Alert.alert(
            "Verificação Falhou",
            `${message}\n\nSimilaridade atingida: ${similarity}%\nLimiar necessário: ${threshold}%\n\nTente novamente.`
          );
        }
      } else {
        Alert.alert("Erro", result.error || "Erro ao verificar voz");
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert("Erro", "Erro inesperado na verificação por voz");
    }
  };

  const handleRecordToggle = async () => {
    if (isRecording) {
      if (recordingTime < 5) {
        Alert.alert(
          "Gravação muito curta",
          "Grave por pelo menos 5 segundos para uma melhor verificação."
        );
        return;
      }
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDarkMode ? "#232323" : "#fff" },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text
              style={[
                styles.modalTitle,
                { color: isDarkMode ? "#fff" : "#000" },
              ]}
            >
              VERIFICAÇÃO DE VOZ
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon
                name="close"
                size={24}
                color={isDarkMode ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Icon
              name="mic"
              size={60}
              color={isDarkMode ? "#4CAF50" : "#28a745"}
              style={styles.micIcon}
            />

            <Text
              style={[styles.userName, { color: isDarkMode ? "#fff" : "#000" }]}
            >
              Olá, {userName}!
            </Text>

            <Text
              style={[
                styles.instruction,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              {isLoading
                ? "Carregando frase..."
                : "Leia a frase abaixo em voz alta para confirmar sua identidade.\n\nGrave por pelo menos 5 segundos. A gravação será interrompida automaticamente após 12 segundos."}
            </Text>

            <View
              style={[
                styles.fraseContainer,
                {
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#f5f5f5",
                  borderColor: isDarkMode ? "#444" : "#ddd",
                },
              ]}
            >
              <Icon
                name="format-quote"
                size={24}
                color={isDarkMode ? "#666" : "#999"}
                style={styles.quoteIcon}
              />
              <Text
                style={[styles.frase, { color: isDarkMode ? "#fff" : "#000" }]}
              >
                {phrase || "Carregando..."}
              </Text>
            </View>

            <Animated.View
              style={[
                styles.recordButtonContainer,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.recordButton,
                  {
                    backgroundColor: isRecording ? "#dc3545" : "#28a745",
                  },
                ]}
                onPress={handleRecordToggle}
                disabled={isLoading}
              >
                <Icon
                  name={isRecording ? "stop" : "mic"}
                  size={40}
                  color="#fff"
                />
              </TouchableOpacity>
            </Animated.View>

            <Text
              style={[
                styles.recordStatus,
                { color: isDarkMode ? "#ccc" : "#666" },
              ]}
            >
              {isRecording
                ? `Gravando... ${formatDuration(recordingTime)} ${
                    recordingTime < 5 ? "(mínimo 5s)" : ""
                  }`
                : recordingUri
                ? "Gravação concluída! Toque em 'Verificar' para continuar."
                : "Toque no microfone para começar a gravar"}
            </Text>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: recordingUri ? "#28a745" : "#ccc",
                  },
                ]}
                disabled={!recordingUri || isLoading}
                onPress={handleConfirm}
                loading={isLoading}
              >
                {isLoading ? "Verificando..." : "Verificar Voz"}
              </Button>

              <Button
                mode="text"
                style={styles.cancelButton}
                onPress={onClose}
                textColor={isDarkMode ? "#ccc" : "#666"}
              >
                Cancelar
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxWidth: 400,
    borderRadius: 15,
    padding: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
    alignItems: "center",
  },
  micIcon: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  instruction: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  fraseContainer: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 25,
    minHeight: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  quoteIcon: {
    position: "absolute",
    top: 5,
    left: 10,
  },
  frase: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    paddingTop: 10,
    fontStyle: "italic",
  },
  recordButtonContainer: {
    marginBottom: 20,
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  recordStatus: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
    minHeight: 40,
  },
  buttonContainer: {
    width: "100%",
    gap: 10,
  },
  confirmButton: {
    paddingVertical: 5,
  },
  cancelButton: {
    marginTop: 5,
  },
});

export default VoiceRecognitionModal;
