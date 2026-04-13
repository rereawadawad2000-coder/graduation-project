import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import PrimaryButton from '../components/PrimaryButton';
import { theme } from '../constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <View style={styles.logoBlock}>
          <View style={styles.logoIconWrap}>
            <Feather name="target" size={30} color={theme.colors.accent} />
          </View>
          <Text style={styles.logoText}>
            Check <Text style={styles.logoAccent}>My</Text> Mole
          </Text>
        </View>

        <View style={styles.illustrationCard}>
          <View style={styles.illustrationBubble}>
            <LottieView
              source={require('../assets/lotties/doctor-floating.json')}
              autoPlay
              loop
              style={styles.onboardingLottie}
            />
          </View>
          <View style={styles.floatingIcons}>
            <Pressable style={styles.floatingDot}>
              <Feather name="heart" size={14} color={theme.colors.accent} />
            </Pressable>
            <Pressable style={styles.floatingDot}>
              <Feather name="activity" size={14} color={theme.colors.accent} />
            </Pressable>
          </View>
        </View>

        <Text style={styles.title}>
          Search Near by{`\n`}
          <Text style={styles.titleAccent}>Dermatologists</Text>
        </Text>
        <Text style={styles.subtitle}>
          Check suspicious skin changes quickly, then connect with experts when you need professional care.
        </Text>

        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <PrimaryButton label="Get Started" onPress={() => router.replace('/(tabs)')} />

        <Text style={styles.footerNote}>This app is a support tool, not a medical diagnosis.</Text>
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
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  logoBlock: {
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  logoIconWrap: {
    width: 84,
    height: 84,
    borderRadius: 26,
    backgroundColor: theme.colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFD2B3',
  },
  logoText: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.brand,
    fontSize: 24,
    letterSpacing: 0.2,
  },
  logoAccent: {
    color: theme.colors.accent,
  },
  illustrationCard: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 280,
    gap: theme.spacing.md,
  },
  illustrationBubble: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#FCEEE2',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#F7DDC8',
    overflow: 'hidden',
  },
  onboardingLottie: {
    width: 230,
    height: 230,
  },
  floatingIcons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  floatingDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFF4EA',
    borderWidth: 1,
    borderColor: '#F8D8BE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodyBold,
    textAlign: 'center',
    fontSize: 40,
    lineHeight: 46,
    letterSpacing: -0.6,
  },
  titleAccent: {
    color: theme.colors.accent,
    fontFamily: theme.typography.bodyBold,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontFamily: theme.typography.body,
    fontSize: theme.typography.sizeMd,
    lineHeight: 22,
    paddingHorizontal: theme.spacing.sm,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 22,
    height: 4,
    borderRadius: 6,
    backgroundColor: '#E8D9CC',
  },
  dotActive: {
    width: 36,
    backgroundColor: theme.colors.accent,
  },
  footerNote: {
    color: theme.colors.textMuted,
    textAlign: 'center',
    fontFamily: theme.typography.body,
    fontSize: theme.typography.sizeXs,
    marginTop: 6,
  },
});
