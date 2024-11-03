'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@components/ui/card';
import ProfilePicture from '@components/ProfilePicture';
import TabNavigation from '@components/TabNavigation';
import PersonalDataForm from '@components/PersonalDataForm';
import SecurityForm from '@components/SecurityForm';
import useAuthRedirect from '@hooks/useAuthRedirect';
import { getProfile } from '@api/profile';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rut, setRut] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [activeTab, setActiveTab] = useState('Datos Personales');

  const isAuthorized = useAuthRedirect(['default', 'admin', 'employee']);

  const fetchProfileData = async () => {
    try {
      const profileData = await getProfile();
      setName(profileData.name_user);
      setPhone(profileData.phone_user);
      setRut(profileData.rut);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchProfileData();
    }
  }, [isAuthorized]);

  if (!isAuthorized) {
    return null;
  }

  return (
    <main className="flex items-center justify-center">
      <Card className="w-full max-w-2xl px-12 py-12 bg-card rounded-2xl shadow-xl border-none">
        <CardContent className="space-y-8">
          <ProfilePicture
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
          />
          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'Datos Personales' ? (
            <PersonalDataForm
              name={name}
              setName={setName}
              phone={phone}
              setPhone={setPhone}
              rut={rut}
            />
          ) : (
            <SecurityForm />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
