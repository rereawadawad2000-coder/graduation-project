import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { theme } from '../../constants/theme';

const existingMoles = [
  { id: '1', title: 'Inconclusive Results', date: '13 February 2024', image: require('../../assets/images/home/openverse-4.jpg') },
  { id: '2', title: 'Inconclusive Results', date: '08 February 2024', image: require('../../assets/images/home/openverse-5.jpg') },
  { id: '3', title: 'Inconclusive Results', date: '02 February 2024', image: require('../../assets/images/home/openverse-6.jpg') },
];

const doctors = [
  {
    id: '1',
    name: 'Dr. Jane Cooper',
    phone: '(603) 555-0123',
    rating: '4.8',
    image: require('../../assets/images/home/openverse-2.jpg'),
  },
  {
    id: '2',
    name: 'Dr. Wade Warren',
    phone: '(603) 555-0199',
    rating: '4.7',
    image: require('../../assets/images/home/openverse-1.jpg'),
  },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color={theme.colors.textPrimary} />
            </View>
            <View>
              <Text style={styles.greeting}>Hello, Jenny</Text>
              <Text style={styles.greetingMeta}>Age, 23 y/o</Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable style={styles.iconAction}>
              <Feather name="search" size={18} color={theme.colors.icon} />
            </Pressable>
            <Pressable style={styles.iconAction}>
              <Feather name="bell" size={18} color={theme.colors.icon} />
            </Pressable>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroTitle}>Scan your moles</Text>
            <Text style={styles.heroSubtitle}>Skin tests with help of AI to monitor</Text>

            <Pressable style={styles.heroCta} onPress={() => router.push('/scan')}>
              <Text style={styles.heroCtaLabel}>Scan Mole</Text>
              <Feather name="arrow-right" size={15} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.heroArt}>
            <View style={styles.heroArtCircle}>
              <LottieView
                source={require('../../assets/lotties/heartbeat.json')}
                autoPlay
                loop
                style={styles.heroLottie}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Existing Mole</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {existingMoles.map((item) => (
            <View key={item.id} style={styles.moleCard}>
              <View style={styles.molePreview}>
                <Image source={item.image} style={styles.molePreviewImage} resizeMode="cover" />
              </View>
              <Text style={styles.moleTitle}>{item.title}</Text>
              <Text style={styles.moleDate}>{item.date}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Nearby Dermatologists</Text>
          <Text style={styles.sectionAction}>See all</Text>
        </View>

        <View style={styles.doctorList}>
          {doctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <View style={styles.doctorAvatar}>
                <Image source={doctor.image} style={styles.doctorAvatarImage} resizeMode="cover" />
              </View>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.doctorPhone}>{doctor.phone}</Text>
              </View>
              <View style={styles.ratingPill}>
                <Feather name="star" size={12} color="#F5A623" />
                <Text style={styles.ratingLabel}>{doctor.rating}</Text>
              </View>
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
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FBD8C0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 17,
  },
  greetingMeta: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  iconAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroCard: {
    backgroundColor: '#FDEEE3',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#F4D7C1',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  heroCopy: {
    flex: 1,
    gap: 8,
  },
  heroTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  heroSubtitle: {
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.body,
    fontSize: theme.typography.sizeSm,
  },
  heroCta: {
    marginTop: 4,
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  heroCtaLabel: {
    color: '#FFFFFF',
    fontFamily: theme.typography.bodySemi,
    fontSize: 13,
  },
  heroArt: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroArtCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F4D7C1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroLottie: {
    width: 100,
    height: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  sectionTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodyBold,
    fontSize: 18,
  },
  sectionAction: {
    color: theme.colors.accent,
    fontFamily: theme.typography.bodySemi,
    fontSize: 13,
  },
  horizontalList: {
    gap: theme.spacing.sm,
    paddingVertical: 2,
  },
  moleCard: {
    width: 148,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 8,
    gap: 8,
  },
  molePreview: {
    height: 94,
    borderRadius: 10,
    backgroundColor: '#FDE7D7',
    overflow: 'hidden',
  },
  molePreviewImage: {
    width: '100%',
    height: '100%',
  },
  moleTitle: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 12,
  },
  moleDate: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 11,
  },
  doctorList: {
    gap: theme.spacing.sm,
  },
  doctorCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  doctorAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: theme.colors.accentSoft,
    overflow: 'hidden',
  },
  doctorAvatarImage: {
    width: '100%',
    height: '100%',
  },
  doctorInfo: {
    flex: 1,
    gap: 2,
  },
  doctorName: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 14,
  },
  doctorPhone: {
    color: theme.colors.textMuted,
    fontFamily: theme.typography.body,
    fontSize: 12,
  },
  ratingPill: {
    borderRadius: 999,
    backgroundColor: '#FFF4EA',
    borderWidth: 1,
    borderColor: '#FFDABD',
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingLabel: {
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.bodySemi,
    fontSize: 12,
  },
});
