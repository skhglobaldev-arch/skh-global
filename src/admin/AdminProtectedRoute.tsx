import React from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getFirebaseAuth, isFirebaseConfigured } from '../firebase/client';

type Props = {
  children: React.ReactNode;
};

export const AdminProtectedRoute: React.FC<Props> = ({ children }) => {
  const [user, setUser] = React.useState<User | null | undefined>(undefined);

  React.useEffect(() => {
    if (!isFirebaseConfigured()) {
      setUser(null);
      return;
    }

    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050713] text-cyan-200">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
