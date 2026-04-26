import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { languages, LanguageCode } from '@/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Globe } from 'lucide-react';

const LanguageSelectionPopup = () => {
  const { isInitialized, setLanguage, t, language: currentLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');

  useEffect(() => {
    // Only show if not initialized
    if (!isInitialized) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [isInitialized]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setLanguage(selectedLang);
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 animate-fade-in p-4">
      <Card className="w-full max-w-2xl p-6 bg-white dark:bg-slate-900 border-border shadow-2xl">
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
            {t('selectLanguage')}
          </h2>
          <p className="text-muted-foreground">
            Choose your preferred language / अपनी पसंदीदा भाषा चुनें
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8 max-h-[50vh] overflow-y-auto p-2 scrollbar-hide">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang.code)}
              className={`p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                selectedLang === lang.code
                  ? 'border-primary bg-primary/10 shadow-sm scale-105'
                  : 'border-border hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-bold text-lg text-foreground">{lang.nativeName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            className="w-full sm:w-auto px-12 py-6 text-lg rounded-full font-bold shadow-[0_8px_32px_rgba(31,38,135,0.2)] hover:scale-105 transition-transform"
            onClick={handleConfirm}
          >
            {t('continue')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LanguageSelectionPopup;
