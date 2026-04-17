import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

type PredictResponse = {
  predicted_class: string;
  confidence: number;
  probabilities: Record<string, number>;
  disclaimer: string;
};

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  Platform.select({
    android: 'http://10.0.2.2:8000',
    ios: 'http://127.0.0.1:8000',
    default: 'http://127.0.0.1:8000',
  });

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [disclaimerText, setDisclaimerText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo access to scan images.');
      return;
    }

    const selected = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (selected.canceled) {
      return;
    }

    setImageUri(selected.assets[0].uri);
    setResultText(null);
  };

  const runPrediction = async () => {
    if (!imageUri) {
      Alert.alert('No image selected', 'Pick an image before running AI result.');
      return;
    }

    setIsLoading(true);
    setResultText(null);
    setDisclaimerText(null);

    try {
      const fileName = imageUri.split('/').pop() ?? 'scan.jpg';
      const ext = fileName.split('.').pop()?.toLowerCase();
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

      const formData = new FormData();
      formData.append(
        'file',
        {
          uri: imageUri,
          name: fileName,
          type: mimeType,
        } as any
      );

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      const payload = (await response.json()) as Partial<PredictResponse> & { detail?: string };
      if (!response.ok) {
        throw new Error(payload.detail ?? 'Prediction request failed.');
      }

      const predictedClass = payload.predicted_class ?? 'unknown';
      const confidence = (payload.confidence ?? 0) * 100;

      setResultText(`${predictedClass.toUpperCase()} (${confidence.toFixed(1)}%)`);
      setDisclaimerText(payload.disclaimer ?? 'For educational use only. Not a medical diagnosis.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not connect to prediction API.';
      Alert.alert('Prediction failed', `${message}\n\nTip: Ensure FastAPI is running on ${API_BASE_URL}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.headerRow}>
          <Pressable style={styles.headerIcon}>
            <Feather name="arrow-left" size={18} color={theme.colors.icon} />
          </Pressable>
          <Text style={styles.headerTitle}>Scan Mole</Text>
          <Pressable style={styles.instructionsPill}>
            <Text style={styles.instructionsLabel}>Instructions</Text>
          </Pressable>
        </View>

        <Pressable style={styles.captureBtn} onPress={pickImage}>
          <Ionicons name="camera" size={22} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.retakeText}>Blurry image? Retake!</Text>

        <Pressable style={styles.previewFrame} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.previewPlaceholder}>
              <Text style={styles.placeholderTitle}>Tap to choose image</Text>
              <Text style={styles.placeholderSubtitle}>Your selected skin photo appears here.</Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.helperText}>If you're happy with the picture tap below for AI Result</Text>

        <Pressable
          style={[styles.resultButton, isLoading ? styles.resultButtonDisabled : null]}
          onPress={runPrediction}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Feather name="navigation" size={28} color="#FFFFFF" />
          )}
        </Pressable>

        {resultText ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Prediction</Text>
            <Text style={styles.resultText}>{resultText}</Text>
            {disclaimerText ? <Text style={styles.disclaimerText}>{disclaimerText}</Text> : null}
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  screen: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 16,
  },
  instructionsPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#F5ECE4',
  },
  instructionsLabel: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 11,
  },
  captureBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  retakeText: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  previewFrame: {
    width: 240,
    height: 240,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: theme.colors.accent,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    gap: 8,
    backgroundColor: '#FFF5EB',
  },
  placeholderTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 14,
  },
  placeholderSubtitle: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
  helperText: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontFamily: theme.typography.body,
    fontSize: 15,
    lineHeight: 22,
    width: '85%',
    marginTop: theme.spacing.sm,
  },
  resultButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  resultButtonDisabled: {
    opacity: 0.7,
  },
  resultCard: {
    width: '100%',
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 4,
  },
  resultLabel: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
  resultText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 16,
  },
  disclaimerText: {
    marginTop: 4,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 12,
    lineHeight: 18,
  },
});
