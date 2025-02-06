import { useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { useAuthActions } from "@/hooks/useAuthActions";

export default function AuthModal() {
  const { signIn, signUp, loading, error, clearError, errorVisible } = useAuthActions();
  const [isLogin, setIsLogin] = useState(true);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSubmit = () => {
    if (isLogin) {
      signIn({ email: form.email, password: form.password });
    } else {
      if (form.password !== form.confirmPassword) {
        return;
      }
      signUp({
        username: form.username,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
    }
  };

  return (
    <AuthTemplate
      isLogin={isLogin}
      form={form}
      onFormChange={setForm}
      onSubmit={handleSubmit}
      onToggleMode={() => {
        setIsLogin(!isLogin);
        setForm({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      }}
      keyboardVisible={keyboardVisible}
      loading={loading}
      error={error}
      onDismissError={clearError}
      errorVisible={errorVisible}
    />
  );
}
