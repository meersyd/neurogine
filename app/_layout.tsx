import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: '#0F766E',
          headerStyle: { backgroundColor: '#F3EEE6' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#F3EEE6' },
          headerTitleStyle: { color: '#1C1917', fontWeight: '600' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Catalog' }} />
        <Stack.Screen name="product/[id]" options={{ title: 'Product' }} />
      </Stack>
    </>
  );
}
