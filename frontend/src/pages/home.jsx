"use client";

import { useAuth } from "../context/authContext";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { getProfile } from "@/api/profile";
import { getUsers } from "../api/user";
import { useState, useEffect } from "react";
import { Statistics } from "@/components/home/Statistics";
import { RecentActivity } from "@/components/home/RecentActivity";
import { TopSellingProducts } from "@/components/home/TopSellingProducts";

export default function HomePage() {
  const { user } = useAuth();
  const isAuthorized = useAuthRedirect(["default", "admin", "employee"]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [mesesActivos, setMesesActivos] = useState(0);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [totalProducts, setTotalProducts] = useState(1134); // This should be fetched from an API
  const [recentSales, setRecentSales] = useState(245); // This should be fetched from an API

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

  const fetchTotalUsers = async () => {
    try {
      const users = await getUsers();
      setTotalEmployees(users.length);
    } catch (error) {
      console.error(
        "Error fetching total employees:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchProfileData();
    fetchTotalUsers();
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
      <Statistics
        totalProducts={totalProducts}
        recentSales={recentSales}
        totalEmployees={totalEmployees}
        mesesActivos={mesesActivos}
      />

      {/* Actividad Reciente y Productos Principales */}
      <div className="grid gap-4 md:grid-cols-2">
        <RecentActivity />
        <TopSellingProducts />
      </div>
    </div>
  );
}
