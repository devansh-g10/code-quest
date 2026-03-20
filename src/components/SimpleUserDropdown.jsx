import { useState, useRef, useEffect } from 'react';

const SimpleUserDropdown = ({ user, onLogout, onOpenProfile, onOpenDashboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="simple-dropdown-wrapper" ref={dropdownRef}>
      <button 
        className="avatar-trigger" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {user.avatar ? (
          <img src={user.avatar} alt="Profile" className="user-avatar-circle-img" />
        ) : (
          <div className="user-avatar-circle">
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="simple-dropdown-menu">
          <div className="dropdown-user-info">
            <span className="dropdown-name">{user.name}</span>
            <span className="dropdown-email">{user.email}</span>
          </div>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" onClick={() => { onOpenDashboard(); setIsOpen(false); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Dashboard
          </button>
          <button className="dropdown-item" onClick={() => { onOpenProfile(); setIsOpen(false); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            My Profile
          </button>
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
