import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FilterProvider } from "@/contexts/FilterContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      const parsed = Linking.parse(url);
      setTimeout(() => {
        if (parsed.path?.includes("addFriend")) {
          const username = parsed.path.split("/").pop();
          router.push({
            pathname: "/modals/friendsList",
            params: { userId: username },
          });
        }

        if (parsed.path?.includes("pin")) {
          const pinId = parsed.path.split("/").pop();
          router.push({
            pathname: "/modals/showSex",
            params: { id: pinId },
          });
        }
      }, 100);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <FilterProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modals/friendsList"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/showSex"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="modals/addSex"
            options={{
              presentation: "modal",
              headerShown: false,
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </FilterProvider>
    </QueryClientProvider>
  );
}
