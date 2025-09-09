"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AdminUser extends User {
  role?: string;
}

interface AdminAuthState {
  user: AdminUser | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    user: null,
    session: null,
    loading: true,
    isAdmin: false,
    error: null,
  });

  useEffect(() => {
    console.log("useAdminAuth: Starting auth check");
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log("useAdminAuth: Session check result:", { session: !!session, error });
      if (error) {
        console.error("useAdminAuth: Session error:", error);
        setState((prev) => ({ ...prev, error: error.message, loading: false }));
        return;
      }

      if (session) {
        console.log("useAdminAuth: Found session, checking admin role");
        checkAdminRole(session.user);
      } else {
        console.log("useAdminAuth: No session found");
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await checkAdminRole(session.user);
      } else {
        setState({
          user: null,
          session: null,
          loading: false,
          isAdmin: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (user: User) => {
    try {
      console.log("checkAdminRole: Checking role for user:", user.id);
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch user profile to check role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      console.log("checkAdminRole: Profile query result:", { profile, error });

      if (error) {
        console.error("Error fetching profile:", error);
        setState((prev) => ({
          ...prev,
          error: "Failed to verify admin access",
          loading: false,
        }));
        return;
      }

      const isAdmin = profile?.role === "admin";
      console.log("checkAdminRole: Is admin?", isAdmin, "Role:", profile?.role);

      setState({
        user: { ...user, role: profile?.role },
        session: null, // We'll get this from the auth state
        loading: false,
        isAdmin,
        error: isAdmin ? null : "Access denied. Admin privileges required.",
      });
    } catch (error) {
      console.error("Error checking admin role:", error);
      setState((prev) => ({
        ...prev,
        error: "Failed to verify admin access",
        loading: false,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setState((prev) => ({ ...prev, error: error.message, loading: false }));
        return { success: false, error: error.message };
      }

      if (data.user) {
        await checkAdminRole(data.user);
        return { success: true };
      }

      return { success: false, error: "Authentication failed" };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Authentication failed";
      setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      await supabase.auth.signOut();
      setState({
        user: null,
        session: null,
        loading: false,
        isAdmin: false,
        error: null,
      });
    } catch (error) {
      console.error("Error signing out:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return {
    ...state,
    signIn,
    signOut,
  };
}
