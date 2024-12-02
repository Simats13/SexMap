import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { useFriends } from "@/hooks/useFriends";
import { doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
import { db } from "@/config/firebase";
import { FriendsTemplate } from "@/components/templates/FriendsTemplate";
import { Friend } from "@/components/templates/FriendsTemplate";

type TabType = "added" | "pending";

export default function FriendsListModal() {
  const [activeTab, setActiveTab] = useState<TabType>("added");
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const { data: user } = useAuth();
  const { data: pendingRequests = [] } = useFriendRequests(user?.uid);
  const { data: friends = [] } = useFriends(user?.uid);
  const router = useRouter();

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

  return (
    <FriendsTemplate
      activeTab={activeTab}
      onTabChange={setActiveTab}
      friends={friends}
      pendingRequests={pendingRequests}
      onClose={() => router.back()}
      onRemoveFriend={handleRemoveFriend}
      onAcceptFriend={handleAcceptFriend}
      onRejectFriend={handleRejectFriend}
      selectedFriend={selectedFriend}
      onSelectFriend={setSelectedFriend}
    />
  );
}
