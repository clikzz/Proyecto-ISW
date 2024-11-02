'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@context/authContext';
import { getProfile } from '@api/profile'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ProfileCard() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  
  const fetchProfile = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      console.log("Solicitando datos del perfil...");
      const response = await getProfile();
      setProfile(response);
      setError(null);
      console.log("Datos del perfil recibidos:", response);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center text-muted-foreground">
            Please log in to view your profile.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-none">
      <CardHeader className="flex items-center gap-4">
        <CardTitle className="flex items-center gap-2">
          Profile
          <Button onClick={fetchProfile} className="flex items-center">
            <RefreshCw />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-4 text-red-500">
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        ) : profile ? (
          <div className="space-y-4">
            <div>
              <strong>Nombre:</strong> {profile.name_user}
            </div>
            <div>
              <strong>Teléfono:</strong> {profile.phone_user}
            </div>
            <div>
              <strong>RUT:</strong> {profile.rut}
            </div>
            <div>
              <strong>Fecha de Creación:</strong> {profile.created_at}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-4 text-muted-foreground">
            No profile data found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
