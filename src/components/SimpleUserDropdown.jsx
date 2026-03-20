import { useState, useRef, useEffect } from 'react';

const SimpleUserDropdown = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="simple-dropdown-container" ref={dropdownRef}>
      <button 
        className="avatar-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar-circle">
          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <div className="simple-dropdown-menu">
          <div className="dropdown-user-info">
            <span className="dropdown-name">{user.name}</span>
            <span className="dropdown-email">{user.email}</span>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item signout" onClick={onLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default SimpleUserDropdown;
