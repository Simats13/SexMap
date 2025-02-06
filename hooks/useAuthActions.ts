import { useState } from "react";
import { auth } from "@/config/firebase";
import { db } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  fetchSignInMethodsForEmail,
  signOut as firebaseSignOut,
  deleteUser,
} from "firebase/auth";
import { useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  where,
  query,
  getDocs,
  getDoc,
} from "firebase/firestore";
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
  const [errorVisible, setErrorVisible] = useState(false);
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
        setErrorVisible(true);
        break;
      case "auth/email-already-in-use":
        setError("Cette adresse email est déjà utilisée");
        setErrorVisible(true);
        break;
      case "auth/invalid-email":
        setError("Adresse email invalide");
        setErrorVisible(true);
        break;
      case "auth/weak-password":
        setError("Le mot de passe doit contenir au moins 6 caractères");
        setErrorVisible(true);
        break;
      case "auth/wrong-password":
      case "auth/invalid-credential":
        setError("Email ou mot de passe incorrect");
        setErrorVisible(true);
        break;
      case "auth/user-not-found":
        setError("Aucun compte associé à cette adresse email");
        setErrorVisible(true);
        break;
      default:
        setError("Une erreur est survenue");
        setErrorVisible(true);
        console.error(error);
    }
    setTimeout(() => {
      setError(null);
      setErrorVisible(false);
    }, 3000);
  };

  const signIn = async ({ email, password }: AuthForm) => {
    try {
      setLoading(true);
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
      router.back();
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
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
        email.trim(),
        password
      );
      await updateProfile(user, {
        displayName: username?.trim(),
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        created_time: new Date(),
        display_name: username?.trim(),
        email: email.trim(),
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

  const deleteAccount = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!auth.currentUser) {
        throw new Error("User not found");
      }
      const mapsRef = collection(db, "maps");
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData?.linkId.includes(deviceId)) {
          const mapsDocs = await getDocs(
            query(
              mapsRef,
              where("linkId", "array-contains", deviceId || userData.linkId)
            )
          );
          mapsDocs.forEach(async (document) => {
            await deleteDoc(doc(db, "maps", document.id));
          });
        }
      }

      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await deleteUser(auth.currentUser);
      await firebaseSignOut(auth);
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
    deleteAccount,
    errorVisible
  };
};
