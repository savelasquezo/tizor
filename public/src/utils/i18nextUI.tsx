import React from 'react';
import Flag from 'react-world-flags';
import { Select, SelectItem } from "@nextui-org/react";

interface I18nextUIProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const I18nextUI: React.FC<I18nextUIProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <Select className="!w-20" radius={'sm'} selectedKeys={[selectedLanguage]} disabledKeys={[selectedLanguage]} startContent={<Flag code={selectedLanguage} className="w-6 h-6" />}>
      <SelectItem onClick={() => onLanguageChange('us')} key="us" startContent={<Flag code="us" className="w-6 h-6" />}></SelectItem>
      <SelectItem onClick={() => onLanguageChange('es')} key="es" startContent={<Flag code="es" className="w-6 h-6" />}></SelectItem>
      <SelectItem onClick={() => onLanguageChange('pt')} key="pt" startContent={<Flag code="pt" className="w-6 h-6" />}></SelectItem>
      <SelectItem onClick={() => onLanguageChange('fr')} key="fr" startContent={<Flag code="fr" className="w-6 h-6" />}></SelectItem>
    </Select>
  );
};

export default I18nextUI;
