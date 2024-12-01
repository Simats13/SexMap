import { useQuery } from "@tanstack/react-query";
import { User } from "firebase/auth";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export function useAuth() {
  return useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: () =>
      new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          resolve(user);
          unsubscribe();
        });
      }),
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
} 