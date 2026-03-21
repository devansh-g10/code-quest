import React, { useState, useEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Code2, 
  CheckCircle2, 
  Clock,
  ExternalLink
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
    hackerrank: user.hackerrank || '',
    codeforces: user.codeforces || '',
    codechef: user.codechef || '',
    geeksforgeeks: user.geeksforgeeks || '',
    linkedin: user.linkedin || ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    leetcode: null,
    loading: false
  });

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const extractHandle = (input) => {
    if (!input) return '';
    if (input.includes('/') && input.startsWith('http')) {
      const parts = input.trim().replace(/\/$/, '').split('/');
      return parts[parts.length - 1];
    }
    return input.trim();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const cleanedData = {
       ...formData,
       leetcode: extractHandle(formData.leetcode),
       hackerrank: extractHandle(formData.hackerrank),
       codeforces: extractHandle(formData.codeforces),
       codechef: extractHandle(formData.codechef),
       geeksforgeeks: extractHandle(formData.geeksforgeeks)
    };

    try {
      const res = await fetch(`${API_BASE}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cleanedData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      onUpdateUser(data.user);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      
      setTimeout(() => fetchPlatformStats(), 200); 
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, avatar: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const fetchPlatformStats = async () => {
    if (!user.leetcode) return;
    setStats(prev => ({ ...prev, loading: true }));

    try {
      const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${user.leetcode}`);
      const data = await res.json();
      if (data.status === 'success') {
        setStats({ leetcode: data, loading: false });
      } else {
        setStats({ leetcode: null, loading: false });
      }
    } catch (err) {
      setStats({ leetcode: null, loading: false });
    }
  };

  useEffect(() => {
    fetchPlatformStats();
  }, [user.leetcode]);

  // Calculate Dash array for circle
  const solvedPercentage = stats.leetcode ? (stats.leetcode.totalSolved / stats.leetcode.totalQuestions) * 100 : 0;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (solvedPercentage / 100) * circumference;

  return (
    <div className="profile-page animate-v3">
      <div className="bg-float-dots"></div>
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>

      <div className="profile-container">
        {message.text && (
          <div className={`alert-msg ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-hero-v3 premium-glass">
            <div className="profile-hero-main">
              <div className="avatar-xl-wrapper">
                 <img src={formData.avatar || user.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="Profile" className="avatar-xl" />
                 {isEditing && (
                    <label className="avatar-upload-icon">
                       <Camera size={24} />
                       <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                 )}
              </div>
              <div className="profile-hero-details">
                 {isEditing ? (
                    <input 
                      type="text" 
                      className="premium-input-name" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 ) : (
                    <h1 className="premium-display-name">{user.name}</h1>
                 )}
                 <p className="premium-email-tag"><Mail size={14} /> {user.email}</p>
                 {isEditing ? (
                    <textarea 
                      className="premium-input-bio" 
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    />
                 ) : (
                    <p className="premium-bio-text">{user.bio || 'Building the future of coding on CodeQuest.'}</p>
                 )}
              </div>
            </div>
            <div className="profile-hero-meta">
               <div className="hero-stat-pill">
                  <span className="pill-val">PRO</span>
                  <span className="pill-lbl">Account Status</span>
               </div>
               <button 
                 className={`premium-action-btn edit`}
                 onClick={isEditing ? handleSave : () => setIsEditing(true)}
                 disabled={loading}
               >
                 {loading ? 'Processing...' : (isEditing ? <><Save size={18}/> SAVE</> : <><Edit3 size={18}/> EDIT DASHBOARD</>)}
               </button>
            </div>
        </div>

        <div className="profile-grid">
           <div className="profile-section-card glass-card">
              <h3 className="section-title-alt">
                <div className="title-icon-box"><Globe size={18} /></div> 
                Social Links & Handles
              </h3>
              <div className="social-links-list">
                 <div className="social-link-item">
                    <div className="icon-box github"><Github size={20} /></div>
                    {isEditing ? (
                       <input type="text" placeholder="GitHub URL" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
                    ) : (
                       <a href={user.github} target="_blank" rel="noreferrer" className={user.github ? 'active' : 'inactive'}>
                         {user.github ? 'GitHub Profile' : 'Not Linked'}
                       </a>
                    )}
                 </div>
                 <div className="social-link-item">
                    <div className="icon-box leetcode"><Code2 size={20} /></div>
                    {isEditing ? (
                       <input type="text" placeholder="LeetCode" value={formData.leetcode} onChange={(e) => setFormData({...formData, leetcode: e.target.value})} />
                    ) : (
                       <a href={user.leetcode ? `https://leetcode.com/u/${user.leetcode}` : '#'} target="_blank" rel="noreferrer" className={user.leetcode ? 'active' : 'inactive'}>
                         {user.leetcode ? `@${user.leetcode}` : 'Not Linked'}
                       </a>
                    )}
                 </div>
                 <div className="social-link-item">
                    <div className="icon-box hackerrank"><div className="hr-icon">HR</div></div>
                    {isEditing ? (
                       <input type="text" placeholder="HackerRank" value={formData.hackerrank} onChange={(e) => setFormData({...formData, hackerrank: e.target.value})} />
                    ) : (
                       <a href={user.hackerrank ? `https://www.hackerrank.com/profile/${user.hackerrank}` : '#'} target="_blank" rel="noreferrer" className={user.hackerrank ? 'active' : 'inactive'}>
                         {user.hackerrank ? `@${user.hackerrank}` : 'Not Linked'}
                       </a>
                    )}
                 </div>
                 <div className="social-link-item">
                    <div className="icon-box geeksforgeeks"><div className="gfg-icon">GFG</div></div>
                    {isEditing ? (
                       <input type="text" placeholder="GFG Handle" value={formData.geeksforgeeks} onChange={(e) => setFormData({...formData, geeksforgeeks: e.target.value})} />
                    ) : (
                       <a href={user.geeksforgeeks ? `https://auth.geeksforgeeks.org/user/${user.geeksforgeeks}` : '#'} target="_blank" rel="noreferrer" className={user.geeksforgeeks ? 'active' : 'inactive'}>
                         {user.geeksforgeeks ? `@${user.geeksforgeeks}` : 'Not Linked'}
                       </a>
                    )}
                 </div>
                 <div className="social-link-item">
                    <div className="icon-box linkedin"><Linkedin size={20} /></div>
                    {isEditing ? (
                       <input type="text" placeholder="LinkedIn URL" value={formData.linkedin} onChange={(e) => setFormData({...formData, linkedin: e.target.value})} />
                    ) : (
                       <a href={user.linkedin} target="_blank" rel="noreferrer" className={user.linkedin ? 'active' : 'inactive'}>
                         {user.linkedin ? 'LinkedIn Profile' : 'Not Linked'}
                       </a>
                    )}
                 </div>
              </div>
           </div>

           <div className="profile-section-card glass-card">
              <div className="ps-header-classic">
                 <div className="title-icon-box"><Code2 size={20} /></div> 
                 <h3 className="section-title-alt">Coding Stats</h3>
              </div>
              
              {!user.leetcode ? (
                 <div className="no-stats-msg">Link your LeetCode handle to see visual statistics.</div>
              ) : stats.loading ? (
                 <div className="loading-stats">Fetching your latest progress...</div>
              ) : stats.leetcode ? (
                 <div className="classic-stats-container">
                    <div className="stats-circle-box">
                       <svg className="stats-circle-svg" viewBox="0 0 160 160">
                          <circle className="circle-bg" cx="80" cy="80" r="70" />
                          <circle 
                            className="circle-progress" 
                            cx="80" cy="80" r="70" 
                            style={{ 
                               strokeDasharray: circumference, 
                               strokeDashoffset: dashOffset 
                            }}
                          />
                       </svg>
                       <div className="circle-content">
                          <span className="count-big">{stats.leetcode.totalSolved}</span>
                          <span className="label-sub">Solved</span>
                       </div>
                    </div>

                    <div className="stats-bars-box">
                       <div className="stat-bar-item">
                          <div className="sb-header">
                             <span className="sb-label">Easy</span>
                             <span className="sb-val">{stats.leetcode.easySolved} / {stats.leetcode.totalEasy}</span>
                          </div>
                          <div className="sb-bar-bg"><div className="sb-fill easy" style={{width: `${(stats.leetcode.easySolved/stats.leetcode.totalEasy)*100}%`}}></div></div>
                       </div>
                       <div className="stat-bar-item">
                          <div className="sb-header">
                             <span className="sb-label">Medium</span>
                             <span className="sb-val">{stats.leetcode.mediumSolved} / {stats.leetcode.totalMedium}</span>
                          </div>
                          <div className="sb-bar-bg"><div className="sb-fill medium" style={{width: `${(stats.leetcode.mediumSolved/stats.leetcode.totalMedium)*100}%`}}></div></div>
                       </div>
                       <div className="stat-bar-item">
                          <div className="sb-header">
                             <span className="sb-label">Hard</span>
                             <span className="sb-val">{stats.leetcode.hardSolved} / {stats.leetcode.totalHard}</span>
                          </div>
                          <div className="sb-bar-bg"><div className="sb-fill hard" style={{width: `${(stats.leetcode.hardSolved/stats.leetcode.totalHard)*100}%`}}></div></div>
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="error-stats">Could not load LeetCode data. Please check your handle.</div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
