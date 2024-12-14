"use client";

import useAuthRedirect from "@/hooks/useAuthRedirect";
import { getProfile } from "@/api/profile";
import { useState, useEffect } from "react";
import { Statistics } from "@/components/home/Statistics";
import { RecentActivity } from "@/components/home/RecentActivity";
import { TopSellingProducts } from "@/components/home/TopSellingProducts";

export default function HomePage() {

  const isAuthorized = useAuthRedirect(["admin", "employee"]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");


  const fetchProfileData = async () => {
    try {
      const profileData = await getProfile();
      setName(profileData.name_user);
      setRole(profileData.role_user === "admin" ? "Administrador" : "Empleado");
    } catch (error) {
      console.error(
        "Error fetching profile data:",
        error.response?.data || error.message
      );
    }
  };


  useEffect(() => {
    fetchProfileData();
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="container mx-auto flex flex-col gap-6">
      {/* Sección de bienvenida */}
      <div className="flex items-center justify-between">
        <div style={{ minHeight: "3rem" }}>
          <p className="text-2xl font-bold text-primary">
            Bienvenido/a de nuevo
          </p>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold">{name || "Cargando..."}</p>
            <p className="text-sm text-muted-foreground"> ({role}) </p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <Statistics/>

      {/* Actividad Reciente y Productos Principales */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <TopSellingProducts />
      </div>
    </div>
  );
}
