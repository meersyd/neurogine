import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Product } from '../../data/types/product';
import { colors, radius, spacing } from '../theme';
import { useProductList } from '../hooks/useProductList';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ProductRow } from '../components/ProductRow';

export function ProductListScreen() {
  const router = useRouter();
  const {
    products,
    phase,
    errorMessage,
    isLoadingMore,
    loadMoreError,
    retry,
    loadMore,
  } = useProductList();

  const onPressProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  if (phase === 'loading') {
    return <LoadingState />;
  }

  if (phase === 'error') {
    return <ErrorState message={errorMessage ?? 'Could not load products.'} onRetry={retry} />;
  }

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products yet"
        message="The catalog came back empty. Try again in a moment."
      />
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ProductRow product={item} onPress={onPressProduct} />}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={loadMore}
      onEndReachedThreshold={0.4}
      ListFooterComponent={
        <ListFooter
          isLoadingMore={isLoadingMore}
          loadMoreError={loadMoreError}
          onRetry={loadMore}
        />
      }
    />
  );
}

type ListFooterProps = {
  isLoadingMore: boolean;
  loadMoreError: string | null;
  onRetry: () => void;
};

function ListFooter({ isLoadingMore, loadMoreError, onRetry }: ListFooterProps) {
  if (loadMoreError) {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerError}>{loadMoreError}</Text>
        <Pressable onPress={onRetry} style={styles.footerRetry} accessibilityRole="button">
          <Text style={styles.footerRetryLabel}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!isLoadingMore) {
    return <View style={styles.footerSpacer} />;
  }

  return (
    <View style={styles.footer}>
      <ActivityIndicator color={colors.accent} />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  separator: {
    height: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
  },
  footerSpacer: {
    height: spacing.lg,
  },
  footerError: {
    color: colors.error,
    fontSize: 14,
    textAlign: 'center',
  },
  footerRetry: {
    backgroundColor: colors.error,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  footerRetryLabel: {
    color: colors.surface,
    fontWeight: '700',
  },
});
