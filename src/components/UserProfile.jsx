import { LogOut, Trophy, Award } from 'lucide-react';

const UserProfile = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="user-profile-v3 animate-v3">
      <div className="user-profile-header">
        <div className="avatar-wrapper">
          <div className="avatar-glow"></div>
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          {user.isPremium && <div className="premium-badge-dot" title="Premium Engineer" />}
        </div>
        <div className="user-info">
          <div className="user-name-row">
            <h3 className="user-name">{user.name}</h3>
            {user.isPremium && <Award size={14} className="premium-icon-small" />}
          </div>
          <p className="user-status">
            {user.isPremium ? (
              <span className="status-highlight">Elite Member</span>
            ) : (
              <>Upgrade to <span className="premium-accent">Premium</span> for full access</>
            )}
          </p>
        </div>
      </div>
      
      <div className="profile-mini-stats">
         <div className="mini-stat-item">
            <Trophy size={12} />
            <span>Top 5%</span>
         </div>
         <div className="mini-stat-item">
            <div className="pulse-dot"></div>
            <span>Online</span>
         </div>
      </div>
      
      <button className="sign-out-btn" onClick={onLogout}>
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  );
};

export default UserProfile;
