import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useEffect } from "react";

export const useAuth = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        queryClient.setQueryData(["auth"], user);
      } else {
        queryClient.setQueryData(["auth"], null);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: () => auth.currentUser || null,
    staleTime: Infinity,
  });
};

export { auth }; 