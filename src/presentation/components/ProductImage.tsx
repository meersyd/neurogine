import { useState } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, radius } from '../theme';

type ProductImageProps = {
  uri?: string;
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
};

export function ProductImage({ uri, style, accessibilityLabel }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return (
      <View style={[styles.fallback, style]} accessibilityLabel="Image unavailable">
        <Text style={styles.fallbackLabel}>No image</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, style]}
      contentFit="cover"
      transition={150}
      placeholder={{ color: colors.placeholder }}
      onError={() => setFailed(true)}
      accessibilityLabel={accessibilityLabel}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.placeholder,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.placeholder,
    borderRadius: radius.sm,
  },
  fallbackLabel: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
});
