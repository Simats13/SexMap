import { View, ScrollView } from "react-native";
import { Header } from "../organisms/Header";
import { FriendsTabBar } from "../molecules/FriendsTabBar";
import { FriendItem } from "../atoms/FriendItem";
import { FriendRequestItem } from "../atoms/FriendRequestItem";
import { ConfirmationModal } from "../atoms/ConfirmationModal";
import { EmptyState } from "../molecules/EmptyState";

export interface Friend {
  id: string;
  displayName: string;
}

interface FriendsTemplateProps {
  activeTab: "added" | "pending";
  onTabChange: (tab: "added" | "pending") => void;
  friends: Friend[];
  pendingRequests: Friend[];
  onClose: () => void;
  onRemoveFriend: (friendId: string) => void;
  onAcceptFriend: (friendId: string) => void;
  onRejectFriend: (friendId: string) => void;
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend | null) => void;
}

export const FriendsTemplate = ({
  activeTab,
  onTabChange,
  friends,
  pendingRequests,
  onClose,
  onRemoveFriend,
  onAcceptFriend,
  onRejectFriend,
  selectedFriend,
  onSelectFriend,
}: FriendsTemplateProps) => (
  <View className="flex-1 bg-white">
    <Header title="Amis" onClose={onClose} />
    <FriendsTabBar activeTab={activeTab} onTabChange={onTabChange} />

    <ScrollView className="flex-1 p-4">
      {activeTab === "added" ? (
        <View className="space-y-2">
          {friends.length > 0 ? (
            friends.map((friend) => (
              <FriendItem
                key={friend.id}
                displayName={friend.displayName}
                onRemove={() => onSelectFriend(friend)}
              />
            ))
          ) : (
            <EmptyState
              icon="account-group"
              message="Vous n'avez pas encore d'amis.\nAjoutez des amis pour partager vos expériences !"
            />
          )}
        </View>
      ) : (
        <View className="space-y-2">
          {pendingRequests.length > 0 ? (
            pendingRequests.map((request) => (
              <FriendRequestItem
                key={request.id}
                displayName={request.displayName}
                onAccept={() => onAcceptFriend(request.id)}
                onReject={() => onRejectFriend(request.id)}
              />
            ))
          ) : (
            <EmptyState
              icon="bell-outline"
              message="Aucune demande d'ami en attente."
            />
          )}
        </View>
      )}
    </ScrollView>

    <ConfirmationModal
      visible={!!selectedFriend}
      onClose={() => onSelectFriend(null)}
      onConfirm={() => selectedFriend && onRemoveFriend(selectedFriend.id)}
      title={`Supprimer ${selectedFriend?.displayName} ?`}
      message="Cette action est irréversible. Vous devrez renvoyer une demande d'ami pour vous reconnecter."
    />
  </View>
); 