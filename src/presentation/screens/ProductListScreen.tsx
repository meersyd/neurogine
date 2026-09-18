import { StyleSheet, Text, View } from 'react-native';

export function ProductListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Catalog</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3EEE6',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1917',
  },
});
