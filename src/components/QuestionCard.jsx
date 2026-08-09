import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

const QuestionCard = ({ question }) => {
  const { title, platform, difficulty, link, tags, isPremium, likes, solvedPercentage = 0 } = question;
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  const getPlatformClass = (p) => {
    const mapping = {
      'LeetCode': 'badge-lc',
      'GeeksforGeeks': 'badge-gfg',
      'Codeforces': 'badge-cf',
      'CodeChef': 'badge-cc',
      'HackerRank': 'badge-hr'
    };
    return mapping[p] || 'badge-default';
  };

  const getDifficultyClass = (d) => {
    return `badge-${d.toLowerCase()}`;
  };

  return (
    <div className={`q-card-v3 animate-v3 ${isPremium ? 'q-card-premium' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <span className={`badge ${getPlatformClass(platform)}`}>{platform}</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.6rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {isPremium && (
              <span className="premium-tag-v3">💎 PRO</span>
            )}
            <span className={`badge ${getDifficultyClass(difficulty)}`}>{difficulty}</span>
          </div>
          <button 
            onClick={(e) => {
                e.preventDefault();
                setIsBookmarked(!isBookmarked);
            }}
            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
            aria-label="Bookmark"
          >
            <Star size={16} fill={isBookmarked ? 'currentColor' : 'none'} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: '1.4', marginBottom: '1.2rem', color: 'white' }}>{title}</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.8rem' }}>
        {tags && tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag-item">{tag}</span>
        ))}
        {tags && tags.length > 3 && (
          <span className="tag-item" style={{ opacity: 0.5 }}>+{tags.length - 3}</span>
        )}
      </div>

      <div className="card-progress-section">
        <div className="progress-header">
           <span className="progress-label">{solvedPercentage}% Logged</span>
           {solvedPercentage === 100 && <CheckCircle2 size={14} className="solved-check" />}
        </div>
        <div className="progress-bar-container">
           <div 
             className={`progress-bar-fill ${difficulty.toLowerCase()}`} 
             style={{ width: `${solvedPercentage}%` }}
           ></div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '700' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.82-8.82 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {likes?.toLocaleString()}
        </div>

        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="solve-btn"
          style={{ width: 'fit-content', padding: '0.7rem 1.8rem', fontSize: '0.85rem' }}
        >
          Solve
        </a>
      </div>
    </div>
  );
};

export default QuestionCard;
