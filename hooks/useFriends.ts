import { useQuery } from "@tanstack/react-query";
import { doc, getDoc, onSnapshot, DocumentSnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UserData {
  display_name: string;
  created_time: string;
  friendsList: string[];
  friendsPending: string[];
  friendsRequest: string[];
  email: string;
  linkId: string;
  locationsList: string[];
  partners: string[];
  uid: string;
}

interface Friend {
  id: string;
  displayName: string;
}

export const useFriends = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(doc(db, "users", userId), (doc) => {
      queryClient.invalidateQueries({ queryKey: ["friends", userId] });
    });

    return () => unsubscribe();
  }, [userId, queryClient]);

  return useQuery({
    queryKey: ["friends", userId],
    queryFn: async () => {
      if (!userId) return [];

      const userDoc = await getDoc(doc(db, "users", userId));
      const userData = userDoc.data();
      const friendsList = userData?.friendsList || [];

      if (friendsList.length === 0) return [];

      const friends = await Promise.all(
        friendsList.map(async (friendId: string) => {
          const friendDocRef = doc(db, "users", friendId);
          const friendDocSnap: DocumentSnapshot<DocumentData> = await getDoc(friendDocRef);
          const friendData = friendDocSnap.data() as UserData | undefined;

          if (!friendData) return null;

          return {
            id: friendId,
            displayName: friendData.display_name || "Utilisateur inconnu",
          };
        })
      );

      return friends.filter((f): f is Friend => f !== null);
    },
    enabled: !!userId,
  });
}; 