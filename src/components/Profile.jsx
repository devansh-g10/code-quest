import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Zap,
  Terminal,
  Cpu,
  Trophy,
  Activity
} from 'lucide-react';

// Live Contest Widget Sub-component
const LiveContestWidget = () => {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const contests = [
    { name: 'Weekly Contest 438', platform: 'LeetCode', time: 'LIVE', type: 'live' },
    { name: 'Starters 174', platform: 'CodeChef', time: `${timeLeft.h}h ${timeLeft.m}m`, type: 'upcoming' },
    { name: 'Educational Round 162', platform: 'Codeforces', time: 'Tomorrow', type: 'upcoming' }
  ];

  return (
    <div className="contest-mini-widget animate-v3" style={{animationDelay: '0.2s'}}>
      <div className="cw-header">
         <div className="live-indicator"></div>
         <h4>Live Mission Status</h4>
      </div>
      <div className="contest-list-mini">
         {contests.map((c, i) => (
           <div className="c-item-mini" key={i}>
              <div className="c-info-mini">
                 <span className="c-name-mini">{c.name}</span>
                 <span className="c-platform-mini">{c.platform}</span>
              </div>
              <div className="c-time-mini">
                 <span className={`t-val-mini ${c.type === 'live' ? 'live-text' : ''}`}>
                    {c.time}
                 </span>
                 <span className="t-lbl-mini">{c.type === 'live' ? 'Ends In' : 'Starts In'}</span>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

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

      setTimeout(() => fetchPlatformStats(), 300);
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
        throw new Error('API Sync Issue');
      }
    } catch (err) {
      console.warn("Stats fetch issue:", err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    fetchPlatformStats();
  }, [user.leetcode]);

  // Aggregate Solver Logic (Real-time + Cached Fallback)
  const leetcodeSolved = stats.leetcode?.totalSolved || user.stats?.leetcode || 0;
  const otherSolved = (user.stats?.codeforces || 0) + 
                      (user.stats?.codechef || 0) + 
                      (user.stats?.geeksforgeeks || 0) +
                      (user.stats?.hackerrank || 0);

  const totalSolved = leetcodeSolved + otherSolved;
  
  // XP & Level Formula
  const XP_PER_PROBLEM = 10;
  const XP_PER_LEVEL = 500; // 50 problems per level
  const totalXP = totalSolved * XP_PER_PROBLEM;
  
  const userLevel = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpInCurrentLevel = totalXP % XP_PER_LEVEL;
  const xpProgress = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
 // 0-100%

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

        {/* --- PREMIUM HERO SECTION --- */}
        <div className="profile-hero-section-v4">
          <div className="premium-glow-card">
            <div className="profile-hero-v3">
                <div className="profile-hero-main">
                  <div className="avatar-xl-wrapper">
                     <img src={formData.avatar || user.avatar || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} alt="Profile" className="avatar-xl" />
                     {isEditing && (
                        <label className="avatar-upload-icon">
                           <Camera size={24} />
                           <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                     )}
                     <div className="avatar-glow"></div>
                  </div>
                  <div className="profile-hero-details">
                     {isEditing ? (
                        <input type="text" className="premium-input-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                     ) : (
                        <h1 className="premium-display-name">{user.name}</h1>
                     )}
                     <p className="premium-email-tag"><Mail size={14} /> {user.email}</p>
                     {isEditing ? (
                        <textarea className="premium-input-bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} />
                     ) : (
                        <p className="premium-bio-text">{user.bio || 'Building the future of coding on CodeQuest.'}</p>
                     )}
                  </div>
                </div>
                <div className="profile-hero-meta">
                   <div className="hero-stat-pill">
                      <span className="pill-val">PRO v4.2</span>
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
          </div>
        </div>

        {/* --- MISSION CONTROL GRID --- */}
        <div className="profile-mission-control">
           {/* Level & XP Card */}
           <div className="level-card animate-v3">
              <div className="level-badge">Lvl {userLevel}</div>
              <h3 style={{fontWeight: 800, fontSize: '1.2rem'}}>Mission Progress</h3>

              <div className="xp-container">
                 <div className="xp-header">
                    <span>Target: Lvl {userLevel + 1}</span>
                    <span>{totalXP % 500} / 500 XP</span>
                 </div>
                 <div className="xp-bar-bg">
                    <div className="xp-bar-fill" style={{width: `${xpProgress}%`}}></div>
                 </div>
              </div>

              <div className="tech-stack-section">
                 <h4 className="stack-title">Primary Tech Stack</h4>
                 <div className="stack-tags">
                    <span className="stack-tag">C++</span>
                    <span className="stack-tag">React</span>
                    <span className="stack-tag">Node.js</span>
                    <span className="stack-tag">Python</span>
                 </div>
              </div>
           </div>

           {/* LIVE CONTEST WIDGET */}
           <LiveContestWidget />
        </div>

        {/* Social Links Row */}
        <div className="profile-grid" style={{marginTop: '2.5rem'}}>
           <div className="profile-section-card glass-card">
              <h3 className="section-title-alt">
                <div className="title-icon-box"><Globe size={18} /></div> 
                Communication Channels
              </h3>
              <div className="social-links-list">
                 {[
                   { id: 'github', icon: <Github size={20}/>, label: 'GitHub', url: user.github, full: user.github },
                   { id: 'leetcode', icon: <Code2 size={20}/>, label: 'LeetCode', url: user.leetcode, full: `https://leetcode.com/u/${user.leetcode}` },
                   { id: 'hackerrank', icon: <Terminal size={18}/>, label: 'HackerRank', url: user.hackerrank, full: `https://hackerrank.com/${user.hackerrank}` },
                   { id: 'geeksforgeeks', icon: <Cpu size={18}/>, label: 'GFG Solo', url: user.geeksforgeeks, full: `https://auth.geeksforgeeks.org/user/${user.geeksforgeeks}` },
                   { id: 'linkedin', icon: <Linkedin size={20}/>, label: 'LinkedIn', url: user.linkedin, full: user.linkedin }
                 ].map((social) => (
                   <div className="social-link-item" key={social.id}>
                      <div className={`icon-box ${social.id}`}>{social.icon}</div>
                      {isEditing ? (
                         <input type="text" placeholder={social.label} value={formData[social.id]} onChange={(e) => setFormData({...formData, [social.id]: e.target.value})} />
                      ) : (
                         <a href={social.full ? (social.full.startsWith('http') ? social.full : `https://${social.full}`) : '#'} target="_blank" rel="noreferrer" className={social.url ? 'active' : 'inactive'}>
                           {social.url ? (social.id === 'github' || social.id === 'linkedin' ? `${social.label} Profile` : `@${social.url}`) : 'Not Linked'}
                         </a>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
