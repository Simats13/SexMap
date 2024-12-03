import { useState } from "react";
import { auth } from "@/config/firebase";
import { db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useDeviceId } from "./useDeviceId";

interface AuthForm {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { deviceId } = useDeviceId();

  const validateSignUp = async (form: AuthForm) => {
    if (form.password !== form.confirmPassword) {
      throw { code: "auth/passwords-not-match" };
    }

    if (form.password.length < 6) {
      throw { code: "auth/weak-password" };
    }

    const methods = await fetchSignInMethodsForEmail(auth, form.email);
    if (methods.length > 0) {
      throw { code: "auth/email-already-in-use" };
    }
  };

  const handleError = (error: any) => {
    setLoading(false);
    switch (error.code) {
      case "auth/passwords-not-match":
        setError("Les mots de passe ne correspondent pas");
        break;
      case "auth/email-already-in-use":
        setError("Cette adresse email est déjà utilisée");
        break;
      case "auth/invalid-email":
        setError("Adresse email invalide");
        break;
      case "auth/weak-password":
        setError("Le mot de passe doit contenir au moins 6 caractères");
        break;
      case "auth/wrong-password":
      case "auth/invalid-credential":
        setError("Email ou mot de passe incorrect");
        break;
      case "auth/user-not-found":
        setError("Aucun compte associé à cette adresse email");
        break;
      default:
        setError("Une erreur est survenue");
        console.error(error);
    }
  };

  const signIn = async ({ email, password }: AuthForm) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      router.back();
    } catch (error: any) {
      handleError(error);
    }
  };

  const signUp = async ({
    username,
    email,
    password,
    confirmPassword,
  }: AuthForm) => {
    try {
      setLoading(true);
      setError(null);

      if (!deviceId) {
        throw new Error("Device ID not initialized");
      }

      await validateSignUp({ username, email, password, confirmPassword });

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(user, {
        displayName: username,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        created_time: new Date(),
        display_name: username,
        email: email,
        friendsList: [],
        friendsPending: [],
        friendsRequest: [],
        linkId: [deviceId],
        locationsList: [],
        partners: [],
      });

      router.back();
    } catch (error: any) {
      handleError(error);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    signIn,
    signUp,
    signOut,
    loading,
    error,
    clearError,
  };
};
