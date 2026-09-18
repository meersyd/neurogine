import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import type { Product } from '../../data/types/product';
import { colors, radius, spacing } from '../theme';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useProductList } from '../hooks/useProductList';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { ProductRow } from '../components/ProductRow';
import { SearchBar } from '../components/SearchBar';

const SEARCH_DEBOUNCE_MS = 400;

export function ProductListScreen() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState('');
  const debouncedQuery = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const {
    products,
    phase,
    errorMessage,
    isLoadingMore,
    loadMoreError,
    retry,
    loadMore,
  } = useProductList(debouncedQuery);

  const onPressProduct = (product: Product) => {
    router.push(`/product/${product.id}`);
  };

  const trimmedQuery = debouncedQuery.trim();

  let body = null;
  if (phase === 'loading') {
    body = <LoadingState message={trimmedQuery ? 'Searching…' : 'Loading products…'} />;
  } else if (phase === 'error') {
    body = <ErrorState message={errorMessage ?? 'Could not load products.'} onRetry={retry} />;
  } else if (products.length === 0) {
    body = (
      <EmptyState
        title={trimmedQuery ? 'No matching products' : 'No products yet'}
        message={
          trimmedQuery
            ? `Nothing matched “${trimmedQuery}”. Try a different search.`
            : 'The catalog came back empty. Try again in a moment.'
        }
      />
    );
  } else {
    body = (
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ProductRow product={item} onPress={onPressProduct} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        keyboardShouldPersistTaps="handled"
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

  return (
    <View style={styles.screen}>
      <SearchBar value={searchInput} onChangeText={setSearchInput} />
      {body}
    </View>
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
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
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
