import { View, Text, TouchableOpacity } from "react-native";
import { Input } from "../atoms/Input";
import { PasswordInput } from "../molecules/PasswordInput";
import { Button } from "../atoms/Button";

interface AuthFormProps {
  isLogin: boolean;
  form: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  onFormChange: (form: any) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
  loading: boolean;
  error: string | null;
}

export const AuthForm = ({
  isLogin,
  form,
  onFormChange,
  onSubmit,
  onToggleMode,
  loading,
  error,
}: AuthFormProps) => (
  <View className="bg-white rounded-2xl p-6 mx-4 shadow-lg">
    <Text className="text-2xl font-bold mb-2">
      {isLogin ? "Content de te revoir !" : "Rejoins-nous !"}
    </Text>
    <Text className="text-gray-600 mb-8">
      {isLogin
        ? "Connecte-toi pour retrouver tes expériences"
        : "Crée ton compte pour commencer à partager"}
    </Text>

    {!isLogin && (
      <Input
        placeholder="Nom d'utilisateur"
        value={form.username}
        onChangeText={(text) => onFormChange({ ...form, username: text })}
      />
    )}

    <Input
      placeholder="Adresse email"
      keyboardType="email-address"
      autoCapitalize="none"
      value={form.email}
      onChangeText={(text) => onFormChange({ ...form, email: text })}
    />

    <PasswordInput
      value={form.password}
      onChangeText={(text) => onFormChange({ ...form, password: text })}
    />

    {!isLogin && (
      <PasswordInput
        value={form.confirmPassword}
        onChangeText={(text) =>
          onFormChange({ ...form, confirmPassword: text })
        }
        placeholder="Confirmer le mot de passe"
      />
    )}

    {error && (
      <Text className="text-red-500 text-center mb-4">{error}</Text>
    )}

    <Button
      title={isLogin ? "Se connecter" : "Créer le compte"}
      onPress={onSubmit}
      className="mb-6"
      loading={loading}
    />

    <TouchableOpacity
      onPress={onToggleMode}
      className="items-center"
    >
      <Text className="text-red-500 font-medium mt-5">
        {isLogin ? "Créer un compte" : "Déjà un compte ? Se connecter"}
      </Text>
    </TouchableOpacity>
  </View>
);
