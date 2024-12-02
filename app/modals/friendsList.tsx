import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useFriends } from "@/hooks/useFriends";
import { useFriendsPending } from "@/hooks/useFriendsPending";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";
import { FriendsTemplate } from "@/components/templates/FriendsTemplate";
import { Friend } from "@/components/templates/FriendsTemplate";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
import { usePushNotification } from "@/hooks/usePushNotification";

type TabType = "added" | "pending";

export default function FriendsListModal() {
  const [activeTab, setActiveTab] = useState<TabType>("added");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { data: user } = useAuth();
  const { data: pendingRequests = [] } = useFriendRequests(user?.uid);
  const { data: friends = [] } = useFriends(user?.uid);
  const { data: pendingSent = [] } = useFriendsPending(user?.uid);
  const { sendPushNotification } = usePushNotification(user?.uid);
  const router = useRouter();
  const [friendId, setFriendId] = useState("");
  const params = useLocalSearchParams<{ userId?: string }>();

  useEffect(() => {
    if (params?.userId) {
      setFriendId(params.userId);
    }
  }, [params?.userId]);

  const handleRemoveFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsList: arrayRemove(friendId),
    });
    setSelectedFriend(null);
  };

  const handleAcceptFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsList: arrayUnion(friendId),
      friendsRequest: arrayRemove(friendId),
    });
    await updateDoc(doc(db, "users", friendId), {
      friendsList: arrayUnion(user.uid),
      friendsPending: arrayRemove(user.uid),
    });
    await sendPushNotification(
      [friendId],
      "Demande acceptée",
      `${user.displayName} a accepté votre demande de SexPartner`
    );
  };

  const handleRejectFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsRequest: arrayRemove(friendId),
    });
    await updateDoc(doc(db, "users", friendId), {
      friendsPending: arrayRemove(user.uid),
    });
  };

  const handleAddFriend = async (username: string) => {
    if (!user) return;
    try {
      // Chercher l'utilisateur par son nom d'utilisateur
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("display_name", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("Utilisateur non trouvé");
        return;
      }

      const friendDoc = querySnapshot.docs[0];
      const friendId = friendDoc.id;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (userData?.friendsList?.includes(friendId)) {
        alert("Cette personne est déjà dans vos SexPartner");
        return;
      }

      if (userData?.friendsPending?.includes(friendId)) {
        alert("Demande déjà envoyée à cette personne");
        return;
      }

      if (userData?.friendsRequest?.includes(friendId)) {
        alert("Cette personne vous a déjà envoyé une demande");
        return;
      }

      // Ajouter la demande d'ami
      await updateDoc(doc(db, "users", user.uid), {
        friendsPending: arrayUnion(friendId),
      });
      await updateDoc(doc(db, "users", friendId), {
        friendsRequest: arrayUnion(user.uid),
      });

      await sendPushNotification(
        [friendId],
        "Demande de SexPartner",
        `${user.displayName} vous a envoyé une demande de SexPartner`
      );

      alert("Demande de SexPartner envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'ajout de SexPartner:", error);
      alert("Une erreur est survenue lors de l'envoi de la demande");
    }
  };

  const handleCancelFriend = async (friendId: string) => {
    if (!user) return;
    await updateDoc(doc(db, "users", user.uid), {
      friendsPending: arrayRemove(friendId),
    });
    await updateDoc(doc(db, "users", friendId), {
      friendsRequest: arrayRemove(user.uid),
    });
  };

  return (
    <FriendsTemplate
      activeTab={activeTab}
      onTabChange={setActiveTab}
      friends={friends}
      pendingRequests={pendingRequests}
      pendingSent={pendingSent}
      onClose={() => router.back()}
      onRemoveFriend={handleRemoveFriend}
      onAcceptFriend={handleAcceptFriend}
      onRejectFriend={handleRejectFriend}
      selectedFriend={selectedFriend}
      onSelectFriend={setSelectedFriend}
      onAddFriend={handleAddFriend}
      onCancelFriend={handleCancelFriend}
    />
  );
}
