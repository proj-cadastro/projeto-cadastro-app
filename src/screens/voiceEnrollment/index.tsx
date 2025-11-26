import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import HamburgerMenu from "../../components/HamburgerMenu";
import { useThemeMode } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import {
  checkHealth,
  getChallengePhrase,
  enrollVoice,
} from "../../services/voice-auth/voiceAuthService";
import {
  requestAudioPermissions,
  getRecordingOptions,
  formatDuration,
} from "../../utils/audioUtils";

export default function VoiceEnrollmentScreen() {
  const { theme, isDarkMode } = useThemeMode();
  const { user } = useAuth();

  // Estados do fluxo
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

  // Refs para controle de estado no timer
  const recordingRef = useRef<Audio.Recording | null>(null);
  const isRecordingRef = useRef<boolean>(false);

  // Estados de loading
  const [loading, setLoading] = useState(false);
  const [loadingPhrase, setLoadingPhrase] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(false);

  // Estados de controle
  const [step, setStep] = useState(1); // 1: obter frase, 2: gravar, 3: enviar

  useEffect(() => {
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
  }, []);

  // Função para obter frase de desafio
  const getPhrase = async () => {
    setLoadingPhrase(true);
    const result = await getChallengePhrase();
    setLoadingPhrase(false);

    if (result.success && (result.data?.phrase || result.phrase)) {
      setPhrase(result.data?.phrase || result.phrase || "");
      setStep(2);
    } else {
      Alert.alert("Erro", result.error || "Erro ao obter frase de desafio");
    }
  };

  // Função para iniciar gravação
  const startRecording = async () => {
    try {
      const hasPermission = await requestAudioPermissions();

      if (!hasPermission) {
        Alert.alert(
          "Permissão Negada",
          "Permissão de microfone é necessária para gravar áudio."
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

      console.log(
        "[VoiceEnrollment] Gravação iniciada, configurando timer de 12s..."
      );

      // Iniciar contador de tempo
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000) as NodeJS.Timeout;
      setTimerInterval(interval);

      // Timer automático para parar em 12 segundos
      const autoStop = setTimeout(async () => {
        console.log("[VoiceEnrollment] Timer 12s executado:", {
          hasRecording: !!recordingRef.current,
          isRecording: isRecordingRef.current,
        });
        if (recordingRef.current && isRecordingRef.current) {
          console.log("[VoiceEnrollment] Parando gravação automaticamente...");
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

            console.log(
              "[VoiceEnrollment] Gravação parada automaticamente com sucesso"
            );
          } catch (error) {
            console.error(
              "[VoiceEnrollment] Erro ao parar gravação automaticamente:",
              error
            );
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

      console.log("[VoiceEnrollment] Gravação parada manualmente");
      setStep(3);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Falha ao parar gravação: " + (error as Error).message
      );
    }
  };

  // Função para enviar enrollment
  const handleEnroll = async () => {
    // Validações
    if (!user?.id) {
      Alert.alert("Erro", "Usuário não identificado. Faça login novamente.");
      return;
    }

    if (!phrase) {
      Alert.alert("Erro", "Frase não encontrada. Obtenha uma nova frase.");
      return;
    }

    if (!recordingUri) {
      Alert.alert("Erro", "Gravação não encontrada. Grave novamente.");
      return;
    }

    setLoadingEnroll(true);

    try {
      const audioFile = {
        uri: recordingUri,
        type: "audio/wav",
        name: `voice_enrollment_${user.id}_${Date.now()}.wav`,
      };

      const result = await enrollVoice(user.id.toString(), phrase, audioFile);

      setLoadingEnroll(false);

      if (result.success) {
        Alert.alert(
          "Sucesso!",
          "Voz cadastrada com sucesso! Agora você pode usar autenticação por voz.",
          [
            {
              text: "OK",
              onPress: () => {
                // Reset para começar novamente
                setStep(1);
                setPhrase("");
                setRecordingUri(null);
                setRecordingTime(0);
              },
            },
          ]
        );
      } else {
        Alert.alert("Erro", result.error || "Erro ao cadastrar voz");
      }
    } catch (error) {
      setLoadingEnroll(false);
      Alert.alert("Erro", "Erro inesperado ao cadastrar voz");
    }
  };

  // Função para reiniciar processo
  const resetProcess = () => {
    setStep(1);
    setPhrase("");
    setRecordingUri(null);
    setRecordingTime(0);
    setIsRecording(false);
    if (recording) {
      recording.stopAndUnloadAsync();
      setRecording(null);
    }
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Menu Hamburguer */}
      <View style={styles.menuContainer}>
        <HamburgerMenu />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <MaterialIcons
              name="record-voice-over"
              size={48}
              color={theme.colors.primary}
            />
            <Text style={[styles.title, { color: theme.colors.onBackground }]}>
              Cadastro de Voz
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Configure sua autenticação por voz em 3 passos simples
            </Text>
          </View>

          {/* Passo 1: Obter frase */}
          <View
            style={[styles.section, { backgroundColor: theme.colors.surface }]}
          >
            <Text style={[styles.stepNumber, { color: theme.colors.primary }]}>
              Passo 1
            </Text>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Obter Frase de Desafio
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary },
                loadingPhrase && styles.buttonDisabled,
              ]}
              onPress={getPhrase}
              disabled={loadingPhrase}
            >
              {loadingPhrase ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <MaterialIcons name="refresh" size={20} color="#fff" />
                  <Text style={styles.buttonText}>Gerar Nova Frase</Text>
                </>
              )}
            </TouchableOpacity>

            {phrase ? (
              <View
                style={[
                  styles.phraseContainer,
                  { backgroundColor: theme.colors.background },
                ]}
              >
                <Text
                  style={[
                    styles.phraseLabel,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  Frase para pronunciar:
                </Text>
                <Text
                  style={[
                    styles.phraseText,
                    { color: theme.colors.onBackground },
                  ]}
                >
                  "{phrase}"
                </Text>
              </View>
            ) : null}
          </View>

          {/* Passo 2: Gravar */}
          {step >= 2 && (
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                style={[styles.stepNumber, { color: theme.colors.primary }]}
              >
                Passo 2
              </Text>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Gravar Sua Voz
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.onSurfaceVariant, marginBottom: 20 },
                ]}
              >
                Grave por pelo menos 5 segundos. A gravação será interrompida
                automaticamente após 12 segundos.
              </Text>

              <View style={styles.recordingSection}>
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    {
                      backgroundColor: isRecording
                        ? theme.colors.error
                        : theme.colors.primary,
                    },
                  ]}
                  onPress={
                    isRecording
                      ? () => {
                          if (recordingTime < 5) {
                            Alert.alert(
                              "Gravação muito curta",
                              "Grave por pelo menos 5 segundos para um melhor cadastro."
                            );
                            return;
                          }
                          stopRecording();
                        }
                      : startRecording
                  }
                  disabled={loadingEnroll}
                >
                  <MaterialIcons
                    name={isRecording ? "stop" : "mic"}
                    size={32}
                    color="#fff"
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.recordStatus,
                    { color: theme.colors.onSurfaceVariant },
                  ]}
                >
                  {isRecording
                    ? `Gravando... ${formatDuration(recordingTime)} ${
                        recordingTime < 5 ? "(mínimo 5s)" : ""
                      }`
                    : recordingUri
                    ? "Gravação concluída!"
                    : "Toque para começar a gravar"}
                </Text>
              </View>
            </View>
          )}

          {/* Passo 3: Enviar */}
          {step >= 3 && recordingUri && (
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.surface },
              ]}
            >
              <Text
                style={[styles.stepNumber, { color: theme.colors.primary }]}
              >
                Passo 3
              </Text>
              <Text
                style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
              >
                Finalizar Cadastro
              </Text>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.primary },
                  loadingEnroll && styles.buttonDisabled,
                ]}
                onPress={handleEnroll}
                disabled={loadingEnroll}
              >
                {loadingEnroll ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <MaterialIcons name="check" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Cadastrar Voz</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Botão de reset */}
          {step > 1 && (
            <TouchableOpacity
              style={[
                styles.resetButton,
                { borderColor: theme.colors.onSurfaceVariant },
              ]}
              onPress={resetProcess}
            >
              <MaterialIcons
                name="refresh"
                size={16}
                color={theme.colors.onSurfaceVariant}
              />
              <Text
                style={[
                  styles.resetButtonText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Começar Novamente
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1000,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  testButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 30,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  phraseContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  phraseLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  phraseText: {
    fontSize: 18,
    fontWeight: "500",
    fontStyle: "italic",
    textAlign: "center",
  },
  recordingSection: {
    alignItems: "center",
  },
  recordButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  recordStatus: {
    fontSize: 16,
    textAlign: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  resetButtonText: {
    fontSize: 14,
    marginLeft: 6,
  },
});
