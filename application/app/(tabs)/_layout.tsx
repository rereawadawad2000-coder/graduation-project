import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Tabs } from 'expo-router';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '../../constants/theme';

function ScanTabButton(props: BottomTabBarButtonProps) {
  const isFocused = Boolean(props.accessibilityState?.selected);

  return (
    <Pressable
      accessibilityRole={props.accessibilityRole}
      accessibilityState={props.accessibilityState}
      accessibilityLabel={props.accessibilityLabel}
      testID={props.testID}
      onLongPress={props.onLongPress}
      onPress={props.onPress}
      style={({ pressed }) => [styles.scanButtonWrap, pressed ? styles.scanPressed : undefined]}>
      <View style={[styles.scanButton, isFocused ? styles.scanButtonFocused : undefined]}>
        <MaterialCommunityIcons name="line-scan" size={30} color="#FFFFFF" />
      </View>
    </Pressable>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: theme.colors.background },
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color, size }) => <Feather name="file-text" size={size} color={color} />,
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarIcon: () => null,
          tabBarButton: (props) => <ScanTabButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.colors.tabBar,
    borderTopColor: '#F2DED0',
    borderTopWidth: 1,
    height: 86,
    paddingBottom: 12,
    paddingTop: 8,
  },
  tabLabel: {
    fontFamily: theme.typography.bodySemi,
    fontSize: 11,
    marginTop: 2,
  },
  scanButtonWrap: {
    top: -24,
    alignItems: 'center',
    justifyContent: 'center',
    width: 74,
    height: 74,
    borderRadius: 37,
  },
  scanButton: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: theme.colors.accent,
    borderWidth: 5,
    borderColor: theme.colors.tabBar,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#AE4C05',
    shadowOpacity: 0.28,
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 12,
    elevation: 10,
  },
  scanButtonFocused: {
    backgroundColor: theme.colors.accentDeep,
  },
  scanPressed: {
    transform: [{ scale: 0.96 }],
  },
});
