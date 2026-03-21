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
    hackerrank: user.hackerrank || '',
    codeforces: user.codeforces || '',
    codechef: user.codechef || '',
    geeksforgeeks: user.geeksforgeeks || '',
    linkedin: user.linkedin || ''
  });

  const [message, setMessage] = useState({ type: '', text: '' });
  const [stats, setStats] = useState({
    leetcode: null,
    hackerrank: null,
    codeforces: null,
    codechef: null,
    geeksforgeeks: null,
    loading: false
  });

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

  const fetchPlatformStats = async () => {
    if (!user.leetcode && !user.codeforces && !user.codechef) return;
    
    setStats(prev => ({ ...prev, loading: true }));
    
    try {
      const results = { leetcode: null, hackerrank: null, codeforces: null, codechef: null, geeksforgeeks: null };

      // LC Sync
      if (user.leetcode) {
        try {
          const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${user.leetcode}`);
          if (res.ok) results.leetcode = await res.json();
        } catch (e) { console.error("LC Error:", e); }
      }

      // CF Sync
      if (user.codeforces) {
        try {
          const res = await fetch(`https://codeforces.com/api/user.info?handles=${user.codeforces}`);
          const data = await res.json();
          if (data.status === 'OK') results.codeforces = data.result[0];
        } catch (e) { console.error("CF Error:", e); }
      }

      // CC Sync
      if (user.codechef) {
        try {
          const res = await fetch(`https://codechef-api.vercel.app/${user.codechef}`);
          if (res.ok) results.codechef = await res.json();
        } catch (e) { console.error("CC Error:", e); }
      }

      setStats({ ...results, loading: false });

      // Persist these to backend and get verified stats back
      try {
        const syncRes = await fetch(`${API_BASE}/user/sync-stats`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const syncData = await syncRes.json();
        
        if (syncRes.ok && syncData.stats) {
          onUpdateUser({ ...user, stats: syncData.stats });
        }
      } catch (e) { console.error("Stats persist failed", e); }

    } catch (err) {
      console.error("Stats Fetch Error:", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchPlatformStats();
  }, [user.leetcode, user.hackerrank, user.codeforces, user.codechef, user.geeksforgeeks]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64
        setMessage({ type: 'error', text: 'Image size should be less than 1MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
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
                <label className="avatar-edit-overlay">
                   <Camera size={26} />
                   <span>Upload Photo</span>
                   <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                   />
                </label>
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
           <h3 className="section-title-alt">
             <div className="title-icon-box"><Globe size={18} /></div> 
             Social Links
           </h3>
           <div className="social-links-list">
              <div className="social-link-item">
                 <div className="icon-box github"><Github size={20} /></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="GitHub URL" 
                      value={formData.github}
                      onChange={(e) => setFormData({...formData, github: e.target.value})}
                    />
                 ) : (
                    <a href={user.github} target="_blank" rel="noreferrer" className={user.github ? 'active' : 'inactive'}>
                      {user.github ? 'GitHub Profile' : 'Not Linked'}
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <div className="icon-box leetcode"><Code2 size={20} /></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="LeetCode Handle" 
                      value={formData.leetcode}
                      onChange={(e) => setFormData({...formData, leetcode: e.target.value})}
                    />
                 ) : (
                    <a href={user.leetcode ? `https://leetcode.com/${user.leetcode}` : '#'} target="_blank" rel="noreferrer" className={user.leetcode ? 'active' : 'inactive'}>
                      {user.leetcode ? `@${user.leetcode}` : 'Not Linked'}
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <div className="icon-box hackerrank"><div className="hr-icon">HR</div></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="HackerRank Handle" 
                      value={formData.hackerrank}
                      onChange={(e) => setFormData({...formData, hackerrank: e.target.value})}
                    />
                 ) : (
                    <a href={user.hackerrank ? `https://www.hackerrank.com/${user.hackerrank}` : '#'} target="_blank" rel="noreferrer" className={user.hackerrank ? 'active' : 'inactive'}>
                      {user.hackerrank ? `@${user.hackerrank}` : 'Not Linked'}
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <div className="icon-box codeforces"><div className="cf-icon">CF</div></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="Codeforces Handle" 
                      value={formData.codeforces}
                      onChange={(e) => setFormData({...formData, codeforces: e.target.value})}
                    />
                 ) : (
                    <a href={user.codeforces ? `https://codeforces.com/profile/${user.codeforces}` : '#'} target="_blank" rel="noreferrer" className={user.codeforces ? 'active' : 'inactive'}>
                      {user.codeforces ? `@${user.codeforces}` : 'Not Linked'}
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <div className="icon-box codechef"><div className="cc-icon">Chef</div></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="CodeChef Handle" 
                      value={formData.codechef}
                      onChange={(e) => setFormData({...formData, codechef: e.target.value})}
                    />
                 ) : (
                    <a href={user.codechef ? `https://www.codechef.com/users/${user.codechef}` : '#'} target="_blank" rel="noreferrer" className={user.codechef ? 'active' : 'inactive'}>
                      {user.codechef ? `@${user.codechef}` : 'Not Linked'}
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <div className="icon-box geeksforgeeks"><div className="gfg-icon">GFG</div></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="GFG Handle" 
                      value={formData.geeksforgeeks}
                      onChange={(e) => setFormData({...formData, geeksforgeeks: e.target.value})}
                    />
                 ) : (
                    <a href={user.geeksforgeeks ? `https://auth.geeksforgeeks.org/user/${user.geeksforgeeks}` : '#'} target="_blank" rel="noreferrer" className={user.geeksforgeeks ? 'active' : 'inactive'}>
                      {user.geeksforgeeks ? `@${user.geeksforgeeks}` : 'Not Linked'}
                    </a>
                 )}
              </div>
              <div className="social-link-item">
                 <div className="icon-box linkedin"><Linkedin size={20} /></div>
                 {isEditing ? (
                    <input 
                      type="text" 
                      placeholder="LinkedIn URL" 
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    />
                 ) : (
                    <a href={user.linkedin} target="_blank" rel="noreferrer" className={user.linkedin ? 'active' : 'inactive'}>
                      {user.linkedin ? 'LinkedIn Profile' : 'Not Linked'}
                    </a>
                 )}
              </div>
           </div>
        </div>

        <div className="profile-section-card">
           <h3 className="section-title-alt">
             <div className="title-icon-box"><Code2 size={20} /></div> 
             Coding Stats
           </h3>
            <div className="platform-stats-grid">
               {stats.loading ? (
                 <div className="loading-stats">Syncing live data from platforms...</div>
               ) : !user.leetcode && !user.codeforces && !user.codechef && !user.hackerrank && !user.geeksforgeeks ? (
                 <div className="no-stats-msg">Link your handles above to see real-time stats!</div>
               ) : (
                 <>
                   {user.leetcode && stats.leetcode && (
                     <div className="platform-stat-card lc-border">
                        <div className="ps-header">
                           <span className="ps-title">LeetCode</span>
                           <span className="ps-status">LIVE</span>
                        </div>
                        <div className="ps-main">
                           <div className="ps-count">{stats.leetcode.totalSolved}</div>
                           <div className="ps-label">Total Solved</div>
                        </div>
                        <div className="ps-bars">
                           <div className="ps-bar easy"><div className="ps-bar-fill" style={{width: `${(stats.leetcode.easySolved/stats.leetcode.totalEasy * 100) || 0}%`}}></div></div>
                           <div className="ps-bar med"><div className="ps-bar-fill" style={{width: `${(stats.leetcode.mediumSolved/stats.leetcode.totalMedium * 100) || 0}%`}}></div></div>
                           <div className="ps-bar hard"><div className="ps-bar-fill" style={{width: `${(stats.leetcode.hardSolved/stats.leetcode.totalHard * 100) || 0}%`}}></div></div>
                        </div>
                     </div>
                   )}
                   {user.hackerrank && (
                     <div className="platform-stat-card hr-border">
                        <div className="ps-header">
                           <span className="ps-title">HackerRank</span>
                           <span className="ps-status">SYNC</span>
                        </div>
                        <div className="ps-main">
                           <div className="ps-count">{user.stats?.hackerrank || 0}</div>
                           <div className="ps-label">Solved / Score</div>
                        </div>
                     </div>
                   )}
                   {user.codeforces && stats.codeforces && (
                     <div className="platform-stat-card cf-border">
                        <div className="ps-header">
                           <span className="ps-title">Codeforces</span>
                           <span className="ps-status">LIVE</span>
                        </div>
                        <div className="ps-main">
                           <div className="ps-count">{stats.codeforces.rating || 'N/A'}</div>
                           <div className="ps-label">{stats.codeforces.rank || 'Student'}</div>
                        </div>
                        <div className="ps-footer">
                           <span>Max: {stats.codeforces.maxRating || 'N/A'}</span>
                        </div>
                     </div>
                   )}
                   {user.codechef && stats.codechef && stats.codechef.success !== false && (
                     <div className="platform-stat-card cc-border">
                        <div className="ps-header">
                           <span className="ps-title">CodeChef</span>
                           <span className="ps-status">LIVE</span>
                        </div>
                        <div className="ps-main">
                           <div className="ps-count">{stats.codechef.currentRating || 'N/A'}</div>
                           <div className="ps-label">{stats.codechef.stars || 'Unrated'}</div>
                        </div>
                     </div>
                   )}
                   {user.geeksforgeeks && (
                     <div className="platform-stat-card gfg-border">
                        <div className="ps-header">
                           <span className="ps-title">GeeksforGeeks</span>
                           <span className="ps-status">SYNC</span>
                        </div>
                        <div className="ps-main">
                           <div className="ps-count">{user.stats?.geeksforgeeks || 0}</div>
                           <div className="ps-label">Total Solved</div>
                        </div>
                     </div>
                   )}
                 </>
               )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
