import React, { useState, useEffect } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const latinAmericanCountries = [
  { name: 'Argentina', code: 'AR', dialCode: '+54' },
  { name: 'Bolivia', code: 'BO', dialCode: '+591' },
  { name: 'Brasil', code: 'BR', dialCode: '+55' },
  { name: 'Chile', code: 'CL', dialCode: '+56' },
  { name: 'Colombia', code: 'CO', dialCode: '+57' },
  { name: 'Costa Rica', code: 'CR', dialCode: '+506' },
  { name: 'Cuba', code: 'CU', dialCode: '+53' },
  { name: 'Ecuador', code: 'EC', dialCode: '+593' },
  { name: 'El Salvador', code: 'SV', dialCode: '+503' },
  { name: 'Guatemala', code: 'GT', dialCode: '+502' },
  { name: 'Honduras', code: 'HN', dialCode: '+504' },
  { name: 'México', code: 'MX', dialCode: '+52' },
  { name: 'Nicaragua', code: 'NI', dialCode: '+505' },
  { name: 'Panamá', code: 'PA', dialCode: '+507' },
  { name: 'Paraguay', code: 'PY', dialCode: '+595' },
  { name: 'Perú', code: 'PE', dialCode: '+51' },
  { name: 'República Dominicana', code: 'DO', dialCode: '+1' },
  { name: 'Uruguay', code: 'UY', dialCode: '+598' },
  { name: 'Venezuela', code: 'VE', dialCode: '+58' },
];

export default function PhoneInput({ value, onChange }) {
  const getInitialCountry = () => {
    return (
      latinAmericanCountries.find((country) =>
        value.startsWith(country.dialCode)
      ) || latinAmericanCountries.find((country) => country.code === 'CL')
    );
  };

  const [selectedCountry, setSelectedCountry] = useState(getInitialCountry());

  useEffect(() => {
    setSelectedCountry(getInitialCountry());
  }, [value]);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    onChange(country.dialCode + value.replace(selectedCountry.dialCode, ''));
  };

  const handlePhoneChange = (e) => {
    const phoneNumber = e.target.value;
    onChange(selectedCountry.dialCode + phoneNumber);
  };

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex-shrink-0 w-[120px] flex items-center justify-between"
          >
            <ReactCountryFlag countryCode={selectedCountry.code} svg />
            <span className="ml-2">{selectedCountry.dialCode}</span>
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-h-[300px] overflow-y-auto border-none bg-slate-100 dark:text-white dark:bg-slate-900">
          {latinAmericanCountries.map((country) => (
            <DropdownMenuItem
              key={country.code}
              onSelect={() => handleCountryChange(country)}
              className="flex items-center"
            >
              <ReactCountryFlag
                countryCode={country.code}
                svg
                className="mr-2"
              />
              <span>{country.name}</span>
              <span className="ml-auto">{country.dialCode}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="relative w-full ml-2">
        <Input
          type="tel"
          value={
            value.startsWith(selectedCountry.dialCode)
              ? value.slice(selectedCountry.dialCode.length)
              : value
          }
          onChange={handlePhoneChange}
          className="pl-3"
          placeholder="123456789"
          required
          aria-label="Número de teléfono"
          pattern="[0-9]*"
          inputMode="numeric"
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
    </div>
  );
}
