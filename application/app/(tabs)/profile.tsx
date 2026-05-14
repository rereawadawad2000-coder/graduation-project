import { Feather, Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.avatarWrap}>
          <Ionicons name="person" size={32} color={theme.colors.accent} />
        </View>
        <Text style={styles.name}>Jenny Watson</Text>
        <Text style={styles.email}>jenny@example.com</Text>

        <View style={styles.panel}>
          <View style={styles.row}>
            <Feather name="shield" size={16} color={theme.colors.accent} />
            <Text style={styles.rowLabel}>Privacy and data safety</Text>
          </View>
          <View style={styles.row}>
            <Feather name="help-circle" size={16} color={theme.colors.accent} />
            <Text style={styles.rowLabel}>Help center</Text>
          </View>
          <View style={styles.row}>
            <Feather name="file-text" size={16} color={theme.colors.accent} />
            <Text style={styles.rowLabel}>Terms and conditions</Text>
          </View>
        </View>
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
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.xs,
  },
  avatarWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: theme.colors.accentSoft,
    borderWidth: 1,
    borderColor: '#FFD4B4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 24,
  },
  email: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  panel: {
    width: '100%',
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E5D8',
  },
  rowLabel: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 14,
  },
});
