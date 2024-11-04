import React from 'react';
import Flag from 'react-world-flags';
import { Select, SelectItem } from "@nextui-org/react";

interface I18nextUIProps {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const I18nextUI: React.FC<I18nextUIProps> = ({ selectedLanguage, onLanguageChange }) => {
  return (
    <Select aria-label="i18" radius={'sm'} selectedKeys={[selectedLanguage]} disabledKeys={[selectedLanguage]} startContent={<Flag code={selectedLanguage} className="w-8 h-6" />}>
      <SelectItem onClick={() => onLanguageChange('us')} key="us" startContent={<Flag code="us"/>}> </SelectItem>
      <SelectItem onClick={() => onLanguageChange('es')} key="es" startContent={<Flag code="es"/>}> </SelectItem>
      <SelectItem onClick={() => onLanguageChange('pt')} key="pt" startContent={<Flag code="pt"/>}> </SelectItem>
      <SelectItem onClick={() => onLanguageChange('fr')} key="fr" startContent={<Flag code="fr"/>}> </SelectItem>
    </Select>
  );
};

export default I18nextUI;
