import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { theme } from '../constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'solid' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'solid',
  disabled = false,
  loading = false,
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'solid' ? styles.solid : styles.ghost,
        pressed && !isDisabled ? styles.pressed : undefined,
        isDisabled ? styles.disabled : undefined,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variant === 'solid' ? '#FFFFFF' : theme.colors.accent} />
      ) : (
        <Text style={[styles.label, variant === 'solid' ? styles.solidLabel : styles.ghostLabel]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  solid: {
    backgroundColor: theme.colors.accent,
  },
  ghost: {
    backgroundColor: theme.colors.page,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.86,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontSize: theme.typography.sizeMd,
    fontFamily: theme.typography.bodySemi,
    letterSpacing: 0.2,
  },
  solidLabel: {
    color: '#FFFFFF',
  },
  ghostLabel: {
    color: theme.colors.textPrimary,
  },
});
