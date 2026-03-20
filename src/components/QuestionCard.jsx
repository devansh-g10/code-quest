import React from 'react';

const QuestionCard = ({ question }) => {
  const { title, platform, difficulty, link, tags, isPremium, likes } = question;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span className={`badge ${getPlatformClass(platform)}`}>{platform}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isPremium && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: '800',
              letterSpacing: '0.08em',
              padding: '0.25rem 0.55rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              textTransform: 'uppercase',
            }}>💎 Premium</span>
          )}
          <span className={`badge ${getDifficultyClass(difficulty)}`}>{difficulty}</span>
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', lineHeight: '1.4', marginBottom: '1rem' }}>{title}</h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2rem' }}>
        {tags && tags.slice(0, 3).map(tag => (
          <span key={tag} className="tag-item">{tag}</span>
        ))}
        {tags && tags.length > 3 && (
          <span className="tag-item" style={{ opacity: 0.5 }}>+{tags.length - 3}</span>
        )}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.82-8.82 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          {likes?.toLocaleString()}
        </div>

        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="solve-btn"
          style={{ width: 'fit-content', padding: '0.6rem 1.5rem' }}
        >
          Solve
        </a>
      </div>
    </div>
  );
};

export default QuestionCard;
