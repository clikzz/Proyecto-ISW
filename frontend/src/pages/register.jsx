"use client";

import React from "react";
import { useRouter } from "next/router";
import { UserPlus } from "lucide-react";
import { useAuth } from "@context/authContext";
import RegisterForm from "@components/RegisterForm";

export default function Register() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    router.push("/home");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="bg-card p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <UserPlus className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-foreground mb-4">
            Regístrate
          </h2>
          <p className="text-sm text-center text-muted-foreground mb-6">
            ¿Ya tienes una cuenta?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:text-accent-foreground transition duration-300"
            >
              Inicia sesión
            </a>
          </p>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
