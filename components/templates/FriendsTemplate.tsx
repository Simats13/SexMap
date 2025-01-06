import { View, ScrollView, TouchableOpacity, Modal } from "react-native";
import { Header } from "../organisms/Header";
import { FriendsTabBar } from "../molecules/FriendsTabBar";
import { FriendItem } from "../atoms/FriendItem";
import { FriendRequestItem } from "../atoms/FriendRequestItem";
import { ConfirmationModal } from "../atoms/ConfirmationModal";
import { EmptyState } from "../molecules/EmptyState";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Input } from "../atoms/Input";
import { Text } from "react-native";
import { useState } from "react";

export interface Friend {
  id: string;
  displayName: string;
}

interface FriendsTemplateProps {
  activeTab: "added" | "pending";
  onTabChange: (tab: "added" | "pending") => void;
  friends: Friend[];
  pendingRequests: Friend[];
  pendingSent: Friend[];
  onClose: () => void;
  onRemoveFriend: (friendId: string) => void;
  onAcceptFriend: (friendId: string) => void;
  onRejectFriend: (friendId: string) => void;
  selectedFriend: Friend | null;
  onSelectFriend: (friend: Friend | null) => void;
  onAddFriend: (username: string) => void;
  onCancelFriend: (friendId: string) => void;
}

export const FriendsTemplate = ({
  activeTab,
  onTabChange,
  friends,
  pendingRequests,
  pendingSent,
  onClose,
  onRemoveFriend,
  onAcceptFriend,
  onRejectFriend,
  onCancelFriend,
  selectedFriend,
  onSelectFriend,
  onAddFriend,
}: FriendsTemplateProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [username, setUsername] = useState("");

  return (
    <View className="flex-1 bg-white">
      <Header
        title="Amis"
        onClose={onClose}
        rightElement={
          <TouchableOpacity onPress={() => setShowAddModal(true)}>
            <MaterialCommunityIcons
              name="account-plus"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        }
      />
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
                message="Vous n'avez pas encore d'amis. Ajoutez des amis pour partager vos expériences !"
              />
            )}
          </View>
        ) : (
          <View className="space-y-4">
            {pendingRequests.length > 0 && (
              <View>
                <Text className="text-gray-600 font-medium mb-2">
                  Demandes reçues
                </Text>
                <View className="space-y-2">
                  {pendingRequests.map((request) => (
                    <FriendRequestItem
                      key={request.id}
                      displayName={request.displayName}
                      onAccept={() => onAcceptFriend(request.id)}
                      onReject={() => onRejectFriend(request.id)}
                      onCancel={() => onCancelFriend(request.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {pendingSent.length > 0 && (
              <View>
                <Text className="text-gray-600 font-medium mb-2">
                  Demandes envoyées
                </Text>
                <View className="space-y-2">
                  {pendingSent.map((request) => (
                    <FriendRequestItem
                      key={request.id}
                      displayName={request.displayName}
                      isPending
                      onCancel={() => onCancelFriend(request.id)}
                    />
                  ))}
                </View>
              </View>
            )}

            {pendingRequests.length === 0 && pendingSent.length === 0 && (
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

      <Modal visible={showAddModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <View className="bg-white w-full max-w-sm rounded-lg p-4">
            <Text className="text-xl font-bold mb-4">
              Ajouter un LovePartner
            </Text>
            <Input
              placeholder="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <View className="flex-row justify-end space-x-2 mt-4">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                <Text className="text-gray-700">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  onAddFriend(username);
                  setUsername("");
                  setShowAddModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-red-500"
              >
                <Text className="text-white">Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
