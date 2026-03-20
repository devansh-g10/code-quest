const UserProfile = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="user-profile-v3 animate-v3">
      <div className="user-profile-header">
        <div className="avatar-wrapper">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          {user.isPremium && <div className="premium-badge-dot" />}
        </div>
        <div className="user-info">
          <h3 className="user-name">{user.name}</h3>
          <p className="user-status">
            Access all features with our <span className="premium-accent">Premium subscription!</span>
          </p>
        </div>
      </div>
      
      <button className="sign-out-btn" onClick={onLogout}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile;
