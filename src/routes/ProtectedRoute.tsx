import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

interface Props {

  children: ReactNode;

}

export default function ProtectedRoute({

  children,

}: Props) {

  const {

    user,

    loading,

  } = useAuth();

  if (loading) {

    return (

      <div className="flex h-screen items-center justify-center">

        <div className="text-lg font-medium">

          Loading...

        </div>

      </div>

    );

  }

  if (!user) {

    return <Navigate to="/login" replace />;

  }

  return <>{children}</>;

}