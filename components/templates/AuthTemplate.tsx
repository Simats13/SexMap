import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Header } from "../organisms/Header";
import { AuthForm } from "../organisms/AuthForm";
import { ErrorSnackbar } from "@/components/atoms/ErrorSnackbar";

interface AuthTemplateProps {
  isLogin: boolean;
  form: any;
  onFormChange: (form: any) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
  keyboardVisible: boolean;
  loading: boolean;
  error: string | null;
  onDismissError: () => void;
  errorVisible: boolean;
}

export const AuthTemplate = ({
  isLogin,
  form,
  onFormChange,
  onSubmit,
  onToggleMode,
  keyboardVisible,
  loading,
  error,
  onDismissError,
  errorVisible,
}: AuthTemplateProps) => {
  console.log("error", !!error);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <Header title={isLogin ? "Connexion" : "Créer un compte"} />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingTop: 24,
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthForm
          isLogin={isLogin}
          form={form}
          onFormChange={onFormChange}
          onSubmit={onSubmit}
          onToggleMode={onToggleMode}
          loading={loading}
        />
      </ScrollView>
      <ErrorSnackbar
        message={error}
        visible={errorVisible}
        onDismiss={onDismissError}
        type="error"
        keyboardVisible={keyboardVisible}
      />
    </KeyboardAvoidingView>
  );
};
