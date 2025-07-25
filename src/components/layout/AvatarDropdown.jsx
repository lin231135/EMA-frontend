import { useState, useRef, useEffect } from 'react';
import { Avatar } from '../ui/Avatar';
import { Dropdown, DropdownButton, DropdownMenu, DropdownItem, DropdownLabel, DropdownDivider } from '../ui/Dropdown';
import { UserIcon, CogIcon, LogoutIcon, LoginIcon, RegisterIcon } from '../ui/Icons';

export function AvatarDropdown({ isAuthenticated = false, user = null, onLogin, onRegister, onLogout, translations }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (action) => {
    setIsOpen(false);
    if (action) action();
  };

  return (
    <div ref={dropdownRef}>
      <Dropdown>
        <DropdownButton onClick={handleDropdownClick}>
          <Avatar 
            src={user?.avatar} 
            alt={user?.name || "User"} 
            square 
            size="md"
          />
        </DropdownButton>
        
        <DropdownMenu isOpen={isOpen} anchor="bottom end">
          {!isAuthenticated ? (
            // Usuario no autenticado
            <>
              <DropdownItem onClick={() => handleItemClick(onLogin)}>
                <LoginIcon />
                <DropdownLabel>{translations.login}</DropdownLabel>
              </DropdownItem>
              <DropdownItem onClick={() => handleItemClick(onRegister)}>
                <RegisterIcon />
                <DropdownLabel>{translations.register}</DropdownLabel>
              </DropdownItem>
            </>
          ) : (
            // Usuario autenticado
            <>
              <DropdownItem href="/profile">
                <UserIcon />
                <DropdownLabel>{translations.profile}</DropdownLabel>
              </DropdownItem>
              <DropdownItem href="/settings">
                <CogIcon />
                <DropdownLabel>{translations.settings}</DropdownLabel>
              </DropdownItem>
              <DropdownDivider />
              <DropdownItem onClick={() => handleItemClick(onLogout)}>
                <LogoutIcon />
                <DropdownLabel>{translations.logout}</DropdownLabel>
              </DropdownItem>
            </>
          )}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
