import { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  ExternalLink, 
  Mail, 
  User as UserIcon, 
  Globe, 
  Edit3, 
  Save, 
  X,
  Code2,
  Camera
} from 'lucide-react';

const Profile = ({ user, token, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    bio: user.bio || '',
    avatar: user.avatar || '',
    github: user.github || '',
    leetcode: user.leetcode || '',
    linkedin: user.linkedin || ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      onUpdateUser(data.user);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container animate-v3">
      {message.text && (
        <div className={`alert-msg ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-hero">
        <div className="profile-top-card">
          <div className="profile-avatar-wrapper">
             <img src={formData.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="Profile" className="profile-avatar-large" />
             {isEditing && (
                <div className="avatar-edit-overlay">
                   <Camera size={20} />
                   <input 
                      type="text" 
                      placeholder="Avatar URL" 
                      value={formData.avatar}
                      onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                   />
                </div>
             )}
          </div>
          <div className="profile-main-info">
             {isEditing ? (
                <input 
                  type="text" 
                  className="edit-name-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
             ) : (
                <h1 className="profile-name">{user.name}</h1>
             )}
             <p className="profile-email-sub"><Mail size={14} /> {user.email}</p>
             
             {isEditing ? (
               <textarea 
                  className="edit-bio-input" 
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
               />
             ) : (
               <p className="profile-bio">{user.bio || 'This user prefers to keep their bio a mystery.'}</p>
             )}
          </div>
          <div className="profile-actions">
             {isEditing ? (
                <>
                  <button className="profile-btn save" onClick={handleSave} disabled={loading}>
                    <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button className="profile-btn cancel" onClick={() => setIsEditing(false)}>
                    <X size={18} /> Cancel
                  </button>
                </>
             ) : (
                <button className="profile-btn edit" onClick={() => setIsEditing(true)}>
                  <Edit3 size={18} /> Edit Profile
                </button>
             )}
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-section-card">
           <h3 className="section-title-alt"><Globe size={18} /> Social Links</h3>
           <div className="social-links-list">
              <div className="social-link-item">
                 <Github size={18} className="social-icon" />
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="GitHub URL" 
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                    />
                 ) : (
                    <a href={user.github} target="_blank" rel="noreferrer" className={user.github ? 'active' : 'inactive'}>
                      {user.github ? 'GitHub Profile' : 'Not Linked'} <ExternalLink size={12} />
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <Code2 size={18} className="social-icon" />
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="LeetCode URL" 
                      value={formData.leetcode}
                      onChange={(e) => setFormData({...formData, leetcode: e.target.value})}
                    />
                 ) : (
                    <a href={user.leetcode} target="_blank" rel="noreferrer" className={user.leetcode ? 'active' : 'inactive'}>
                      {user.leetcode ? 'LeetCode Profile' : 'Not Linked'} <ExternalLink size={12} />
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <Linkedin size={18} className="social-icon" />
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="LinkedIn URL" 
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    />
                 ) : (
                    <a href={user.linkedin} target="_blank" rel="noreferrer" className={user.linkedin ? 'active' : 'inactive'}>
                      {user.linkedin ? 'LinkedIn Profile' : 'Not Linked'} <ExternalLink size={12} />
                    </a>
                 )}
              </div>
           </div>
        </div>

        <div className="profile-section-card">
           <h3 className="section-title-alt"><Code2 size={18} /> Coding Stats</h3>
           <div className="coding-stats-placeholder">
              <div className="stat-circle-p">
                <span className="sc-val">4087</span>
                <span className="sc-label">Solved</span>
              </div>
              <div className="stat-mini-grid">
                 <div className="mini-stat">
                    <span className="ms-label">Easy</span>
                    <span className="ms-val">964</span>
                 </div>
                 <div className="mini-stat">
                    <span className="ms-label">Medium</span>
                    <span className="ms-val">2208</span>
                 </div>
                 <div className="mini-stat">
                    <span className="ms-label">Hard</span>
                    <span className="ms-val">915</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
