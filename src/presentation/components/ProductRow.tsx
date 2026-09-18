import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Product } from '../../data/types/product';
import { colors, radius, spacing } from '../theme';
import { formatPrice } from '../formatPrice';
import { ProductImage } from './ProductImage';

type ProductRowProps = {
  product: Product;
  onPress: (product: Product) => void;
};

export function ProductRow({ product, onPress }: ProductRowProps) {
  return (
    <Pressable
      onPress={() => onPress(product)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${product.title}, ${formatPrice(product.price)}`}
    >
      <ProductImage
        uri={product.thumbnail}
        style={styles.thumbnail}
        accessibilityLabel={`${product.title} thumbnail`}
      />
      <View style={styles.copy}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.88,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
  },
  copy: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
});
