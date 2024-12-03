import { useQuery, useQueryClient } from "@tanstack/react-query";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { db } from "@/config/firebase";
import { useEffect } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { useDeviceId } from "./useDeviceId";

export const useAuth = () => {
  const queryClient = useQueryClient();
  const { deviceId } = useDeviceId();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        queryClient.setQueryData(["auth"], user);
        
        // Vérifier et mettre à jour linkId si nécessaire
        if (deviceId) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.linkId?.includes(deviceId)) {
              await updateDoc(doc(db, "users", user.uid), {
                linkId: arrayUnion(deviceId)
              });
            }
          }
        }
      } else {
        queryClient.setQueryData(["auth"], null);
      }
    });

    return () => unsubscribe();
  }, [queryClient, deviceId]);

  return useQuery<User | null>({
    queryKey: ["auth"],
    queryFn: () => auth.currentUser || null,
    staleTime: Infinity,
  });
};

export { auth }; 