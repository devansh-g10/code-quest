import { useState, useMemo, useEffect } from 'react'
import QuestionCard from './components/QuestionCard'
import Login from './components/Login'
import SimpleUserDropdown from './components/SimpleUserDropdown'
import Contests from './components/Contests'
import Profile from './components/Profile'
import Landing from './components/Landing'
import { LayoutGrid, Trophy, Terminal } from 'lucide-react'

const ITEMS_PER_PAGE = 24;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('landing');
  const [token, setToken] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [premiumFilter, setPremiumFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API_BASE}/questions`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Check for persistent login
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const onUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, platformFilter, difficultyFilter, premiumFilter, sortBy]);

  const filteredAndSortedQuestions = useMemo(() => {
    let result = questions.filter(q => {
      const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPlatform = platformFilter === 'All' || q.platform === platformFilter;
      const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const matchesPremium = premiumFilter === 'All' || 
                            (premiumFilter === 'Premium' && q.isPremium) || 
                            (premiumFilter === 'Free' && !q.isPremium);
      return matchesSearch && matchesPlatform && matchesDifficulty && matchesPremium;
    });

    if (sortBy === 'Popularity') {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === 'ID') {
      result.sort((a, b) => a.id.localeCompare(b.id));
    }

    return result;
  }, [searchQuery, platformFilter, difficultyFilter, premiumFilter, sortBy]);

  const currentQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedQuestions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAndSortedQuestions, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedQuestions.length / ITEMS_PER_PAGE);

  const stats = useMemo(() => ({
    total: questions.length,
    filtered: filteredAndSortedQuestions.length,
    premium: questions.filter(q => q.isPremium).length,
    leetcode: questions.filter(q => q.platform === 'LeetCode').length,
    gfg: questions.filter(q => q.platform === 'GeeksforGeeks').length
  }), [questions, filteredAndSortedQuestions]);

  const SidebarButton = ({ label, value, current, onClick, count }) => (
    <button 
      className={`sidebar-btn ${current === value ? 'active' : ''}`}
      onClick={() => onClick(value)}
    >
      {label}
      {count !== undefined && <span className="count">{count}</span>}
    </button>
  );

  if (!user && !localStorage.getItem('token')) {
    return <Login onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div style={{ background: 'var(--bg-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--accent-blue)', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading Library...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'var(--bg-bg)', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: 'var(--accent-red)', textAlign: 'center' }}>
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="sidebar-btn" style={{ marginTop: '2rem' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar animate-v3">
        <div className="logo-section" onClick={() => setActiveTab('landing')} style={{ cursor: 'pointer' }}>
          <h1 className="logo-text">CODEQUEST</h1>
          <span className="version-pill">V3.0</span>
        </div>

        <nav>
          <div className="filter-section">
            <h4 className="filter-section-title">General</h4>
            <button 
              className={`sidebar-btn ${activeTab === 'problems' ? 'active' : ''}`}
              onClick={() => setActiveTab('problems')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={18} /> Problems
              </span>
            </button>
            <button 
              className={`sidebar-btn ${activeTab === 'contests' ? 'active' : ''}`}
              onClick={() => setActiveTab('contests')}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Trophy size={18} /> Contests
              </span>
            </button>
          </div>

          <div className="filter-section">
            <h4 className="filter-section-title">Platforms</h4>
            <SidebarButton label="All Platforms" value="All" current={platformFilter} onClick={setPlatformFilter} count={stats.total} />
            {[...new Set(questions.map(q => q.platform))].map(p => (
              <SidebarButton 
                key={p} 
                label={p} 
                value={p} 
                current={platformFilter} 
                onClick={setPlatformFilter} 
                count={questions.filter(q => q.platform === p).length} 
              />
            ))}
          </div>

          <div className="filter-section">
            <h4 className="filter-section-title">Difficulty</h4>
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <SidebarButton 
                key={d} 
                label={d === 'All' ? 'All Difficulties' : d} 
                value={d} 
                current={difficultyFilter} 
                onClick={setDifficultyFilter} 
                count={d === 'All' ? stats.total : questions.filter(q => q.difficulty === d).length}
              />
            ))}
          </div>

          <div className="filter-section" style={{ marginTop: 'auto' }}>
            <h4 className="filter-section-title">Question Access</h4>
            <SidebarButton label="Free Only" value="Free" current={premiumFilter} onClick={setPremiumFilter} />
            <SidebarButton label="Premium" value="Premium" current={premiumFilter} onClick={setPremiumFilter} count={stats.premium} />
            <SidebarButton label="Reset All" value="All" current={premiumFilter} onClick={() => {
              setPlatformFilter('All');
              setDifficultyFilter('All');
              setPremiumFilter('All');
              setSearchQuery('');
            }} />
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="search-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search concepts, topics or challenge titles..." 
              className="search-input-v3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="sort-group">
            <div className="sort-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="11" y1="5" x2="19" y2="5"></line>
                <line x1="11" y1="12" x2="19" y2="12"></line>
                <line x1="11" y1="19" x2="19" y2="19"></line>
                <polyline points="3 16 6 19 9 16"></polyline>
                <polyline points="3 8 6 5 9 8"></polyline>
              </svg>
              SORT
            </div>
            {['Newest', 'Popularity'].map(s => (
              <button 
                key={s} 
                className={`sort-pill ${sortBy === s ? 'active' : ''}`}
                onClick={() => setSortBy(s)}
              >
                {s}
              </button>
            ))}
          </div>

          <SimpleUserDropdown 
            user={user} 
            onLogout={handleLogout} 
            onOpenProfile={() => setActiveTab('profile')} 
            onOpenDashboard={() => setActiveTab('problems')}
          />
        </header>

        {activeTab === 'landing' ? (
          <Landing onEnter={() => setActiveTab(isLoggedIn ? 'problems' : 'login')} />
        ) : activeTab === 'problems' ? (
          <section className="grid-container">
            <div className="stats-grid animate-v3">
              <div className="stat-card">
                <span className="stat-card-label">Matching Library</span>
                <span className="stat-card-value" style={{ color: 'var(--accent-blue)' }}>{stats.filtered}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Global Questions</span>
                <span className="stat-card-value">{stats.total}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Premium Challenges</span>
                <span className="stat-card-value" style={{ color: 'gold' }}>{stats.premium}</span>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Success Rate</span>
                <span className="stat-card-value" style={{ color: 'var(--accent-green)' }}>+84%</span>
              </div>
            </div>

            <div className="q-grid">
              {currentQuestions.length > 0 ? (
                currentQuestions.map((q, idx) => (
                  <QuestionCard key={`${q.id}-${idx}`} question={q} />
                ))
              ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '10rem 0' }}>
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>No Challenges Found</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Try adjusting your sidebar filters or search query.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '6rem', paddingBottom: '4rem' }}>
                <button 
                  className="sidebar-btn" 
                  style={{ width: 'auto', padding: '0.8rem 2rem' }}
                  onClick={() => {
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) mainContent.scrollTop = 0;
                  }}
                >
                  ← Previous
                </button>
                
                <span style={{ color: 'var(--text-muted)', fontWeight: '700' }}>
                   {currentPage} <span style={{ opacity: 0.3 }}>/</span> {totalPages}
                </span>
                
                <button 
                  className="sidebar-btn" 
                  style={{ width: 'auto', padding: '0.8rem 2rem' }}
                  onClick={() => {
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                    const mainContent = document.querySelector('.main-content');
                    if (mainContent) mainContent.scrollTop = 0;
                  }}
                >
                  Next →
                </button>
              </div>
            )}
          </section>
        ) : activeTab === 'contests' ? (
          <Contests />
        ) : (
          <Profile user={user} token={localStorage.getItem('token')} onUpdateUser={onUpdateUser} />
        )}
      </main>
    </div>
  )
}

export default App
