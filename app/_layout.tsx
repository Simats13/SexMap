import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="modals/addSex" 
        options={{
          presentation: 'modal',
          headerShown: false,
          animation: 'slide_from_bottom'
        }} 
      />
    </Stack>
    <QueryClientProvider client={queryClient}>
    </QueryClientProvider>
  );
}
