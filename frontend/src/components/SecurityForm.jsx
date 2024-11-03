import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import { changePassword } from '@/api/profile';
import { useAlert } from '@context/alertContext';

export default function SecurityForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showAlert } = useAlert();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    try {
      const passwordData = {
        currentPassword: oldPassword,
        newPassword,
      };
      const response = await changePassword(passwordData);
      showAlert(response.message, 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      showAlert(error.response?.data.message, 'error');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handlePasswordChange}>
      <h2 className="text-xl font-semibold text-card-foreground">
        Cambiar clave
      </h2>
      <PasswordField
        label="Actual"
        value={oldPassword}
        onChange={setOldPassword}
        showPassword={showOldPassword}
        toggleShowPassword={setShowOldPassword}
        placeholder="Ingrese su contraseña actual"
      />
      <PasswordField
        label="Nueva"
        value={newPassword}
        onChange={setNewPassword}
        showPassword={showNewPassword}
        toggleShowPassword={setShowNewPassword}
        placeholder="Ingrese su nueva contraseña"
      />
      <PasswordField
        label="Confirmar nueva contraseña"
        value={confirmNewPassword}
        onChange={setConfirmNewPassword}
        showPassword={showConfirmPassword}
        toggleShowPassword={setShowConfirmPassword}
        placeholder="Confirme su nueva contraseña"
      />
      <Button type="submit" className="w-full">
        Cambiar Contraseña
      </Button>
    </form>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  showPassword,
  toggleShowPassword,
}) {
  return (
    <div>
      <Label className="block text-sm text-muted-foreground">{label}</Label>
      <div className="relative mt-1">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => toggleShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
