import { Feather } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

const records = [
  { id: '1', status: 'Inconclusive', date: '13 Feb 2024', score: '71%' },
  { id: '2', status: 'Low Risk', date: '07 Feb 2024', score: '88%' },
  { id: '3', status: 'Follow-up', date: '02 Feb 2024', score: '79%' },
];

export default function RecordsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Records Mole</Text>
        <Text style={styles.subtitle}>Your latest scan history and quick status snapshots.</Text>

        <View style={styles.list}>
          {records.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.statusRow}>
                <Feather name="activity" size={14} color={theme.colors.accent} />
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.scoreText}>Confidence: {item.score}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: 120,
    gap: theme.spacing.sm,
  },
  title: {
    marginTop: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 30,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: 14,
  },
  list: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: 4,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 14,
  },
  dateText: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
  scoreText: {
    color: theme.colors.accentDeep,
    fontFamily: theme.typography.bodySemi,
    fontSize: 12,
  },
});
