import { useLayoutEffect } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { colors, radius, spacing } from '../theme';
import { formatPrice } from '../formatPrice';
import { useProductDetail } from '../hooks/useProductDetail';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ProductImage } from '../components/ProductImage';
import { RatingStars } from '../components/RatingStars';

export function ProductDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const { product, phase, errorMessage, retry } = useProductDetail(id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: product?.title ?? 'Product',
    });
  }, [navigation, product?.title]);

  if (phase === 'loading') {
    return <LoadingState message="Loading product…" />;
  }

  if (phase === 'error') {
    return <ErrorState message={errorMessage ?? 'Could not load this product.'} onRetry={retry} />;
  }

  if (!product) {
    return (
      <EmptyState title="Product unavailable" message="This product could not be found." />
    );
  }

  const gallery = product.images.length > 0 ? product.images : [product.thumbnail];
  const imageWidth = width - spacing.lg * 2;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.gallery}
      >
        {gallery.map((uri) => (
          <ProductImage
            key={uri}
            uri={uri}
            style={[styles.image, { width: imageWidth }]}
            accessibilityLabel={`${product.title} photo`}
          />
        ))}
      </ScrollView>
      {gallery.length > 1 ? (
        <Text style={styles.galleryHint}>Swipe to see more photos</Text>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <RatingStars rating={product.rating} />
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  gallery: {
    borderRadius: radius.lg,
  },
  image: {
    height: 280,
    borderRadius: radius.lg,
    marginRight: spacing.sm,
  },
  galleryHint: {
    color: colors.muted,
    fontSize: 13,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  },
});
