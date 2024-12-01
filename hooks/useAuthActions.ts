import { useState } from 'react';
import { auth } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useRouter } from 'expo-router';

interface AuthForm {
  username?: string;
  email: string;
  password: string;
}

export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleError = (error: any) => {
    setLoading(false);
    switch (error.code) {
      case 'auth/email-already-in-use':
        setError('Cette adresse email est déjà utilisée');
        break;
      case 'auth/invalid-email':
        setError('Adresse email invalide');
        break;
      case 'auth/weak-password':
        setError('Le mot de passe doit contenir au moins 6 caractères');
        break;
      case 'auth/wrong-password':
        setError('Email ou mot de passe incorrect');
        break;
      case 'auth/user-not-found':
        setError('Aucun compte associé à cette adresse email');
        break;
      case 'auth/invalid-credential':
        setError('Email ou mot de passe incorrect');
        break;
      default:
        setError('Une erreur est survenue');
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

  const signUp = async ({ username, email, password }: AuthForm) => {
    try {
      setLoading(true);
      setError(null);
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (username) {
        await updateProfile(user, { displayName: username });
      }
      router.back();
    } catch (error: any) {
      handleError(error);
    }
  };

  const clearError = () => setError(null);

  return {
    signIn,
    signUp,
    loading,
    error,
    clearError,
  };
}; 