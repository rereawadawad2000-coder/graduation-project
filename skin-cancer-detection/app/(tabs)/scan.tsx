import { Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

export default function ScanScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);

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

  const runPrediction = () => {
    if (!imageUri) {
      Alert.alert('No image selected', 'Pick an image before running AI result.');
      return;
    }

    const outcome = Math.random() > 0.5 ? 'Low-risk pattern detected' : 'Please review with dermatologist';
    setResultText(outcome);
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

        <Pressable style={styles.resultButton} onPress={runPrediction}>
          <Feather name="navigation" size={28} color="#FFFFFF" />
        </Pressable>

        {resultText ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Prediction</Text>
            <Text style={styles.resultText}>{resultText}</Text>
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
});
