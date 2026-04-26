import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  AlertTriangle, 
  Syringe, 
  Utensils, 
  Apple, 
  Wallet, 
  FileText, 
  LogOut,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const { currentUser, logout } = useApp();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Home },
    { id: 'emergency', label: t('emergency'), icon: AlertTriangle },
    { id: 'vaccination', label: t('vaccination'), icon: Syringe },
    { id: 'treatment', label: t('treatment'), icon: FileText },
    { id: 'meals', label: t('meals'), icon: Utensils },
    { id: 'nutrition', label: t('nutrition'), icon: Apple },
    { id: 'funding', label: t('funding'), icon: Wallet },
  ];

  const handleNavClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileOpen(false);
  };

  const getRoleBadgeColor = () => {
    switch (currentUser?.role) {
      case 'asha': return 'bg-primary text-primary-foreground';
      case 'pregnant': return 'bg-terracotta text-white';
      case 'elderly': return 'bg-sky text-white';
      case 'infant_family': return 'bg-lavender text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getRoleLabel = () => {
    switch (currentUser?.role) {
      case 'asha': return 'ASHA Worker';
      case 'pregnant': return 'Pregnant Woman';
      case 'elderly': return 'Elderly Person';
      case 'infant_family': return 'Infant Family';
      default: return 'User';
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 z-50 flex items-center justify-between px-4 border-b border-white/30" style={{background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)'}} >
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          <span className="font-heading font-bold text-lg">Maternova</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 pt-16"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 z-40
        border-r border-white/30
        transform transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:translate-x-0 pt-16 lg:pt-0
      `} style={{background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)'}} >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-3 p-6 border-b border-white/30">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-foreground">Maternova</h1>
              <p className="text-xs text-muted-foreground">Healthcare App</p>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-white/30">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/50">
              <p className="font-semibold text-foreground truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                  ID: {currentUser?.patientId}
                </span>
              </div>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                {getRoleLabel()}
              </span>
              <p className="text-xs text-muted-foreground mt-2">{currentUser?.village}</p>
              {currentUser?.loginTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  🕐 Login: {new Date(currentUser.loginTime).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => handleNavClick(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeSection === id
                        ? 'bg-primary text-primary-foreground shadow-soft'
                        : 'text-muted-foreground hover:bg-white/50 hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/30">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5" />
              <span>{t('logout')}</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
