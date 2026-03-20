import { useState, useMemo } from 'react';
import { Trophy, Clock, ExternalLink, Calendar } from 'lucide-react';

const Contests = () => {
  const [contests] = useState([
    {
      id: 1,
      title: "Weekly Contest 389",
      platform: "LeetCode",
      startTime: "Sunday 8:00 AM IST",
      duration: "1h 30m",
      status: "Upcoming",
      prize: "500 Tokens",
      color: "#ffa116"
    },
    {
      id: 2,
      title: "Biweekly Contest 126",
      platform: "LeetCode",
      startTime: "Saturday 8:00 PM IST",
      duration: "1h 30m",
      status: "Upcoming",
      prize: "300 Tokens",
      color: "#ffa116"
    },
    {
      id: 3,
      title: "Starters 125 (Div 1 & 2)",
      platform: "CodeChef",
      startTime: "Wednesday 8:00 PM IST",
      duration: "2h",
      status: "Live",
      prize: "Rating Boost",
      color: "#9d7c6b"
    },
    {
      id: 4,
      title: "ProjectEuler+ Challenges",
      platform: "HackerRank",
      startTime: "Anytime",
      duration: "Self-Paced",
      status: "Ongoing",
      prize: "Gold Medal",
      color: "#2ec866"
    },
    {
      id: 5,
      title: "Codeforces Round 930 (Div 2)",
      platform: "Codeforces",
      startTime: "Friday 8:05 PM IST",
      duration: "2h",
      status: "Upcoming",
      prize: "Global Rank",
      color: "#3b82f6"
    }
  ]);

  return (
    <div className="contests-page animate-v3">
      <header className="page-header">
        <div className="header-info">
          <h1>Competitive Contests</h1>
          <p>Join live contests from top platforms and track your progress.</p>
        </div>
        <div className="contest-search">
           <input type="text" placeholder="Search contests..." className="search-input-v3" />
        </div>
      </header>

      <div className="contest-grid">
        {contests.map(contest => (
          <div key={contest.id} className="contest-card">
            <div className="contest-card-status">
              <span className={`status-pill ${contest.status.toLowerCase()}`}>
                {contest.status === 'Live' && <span className="live-dot"></span>}
                {contest.status}
              </span>
              <span className="platform-tag" style={{ color: contest.color }}>{contest.platform}</span>
            </div>
            
            <h3 className="contest-title">{contest.title}</h3>
            
            <div className="contest-details">
              <div className="detail">
                <Calendar size={14} />
                <span>{contest.startTime}</span>
              </div>
              <div className="detail">
                <Clock size={14} />
                <span>{contest.duration}</span>
              </div>
              <div className="detail">
                <Trophy size={14} />
                <span>{contest.prize}</span>
              </div>
            </div>

            <button className="register-btn">
              Register Now <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="contest-calendar-section">
        <h2 className="section-title">Contest Calendar</h2>
        <div className="calendar-placeholder">
          <p>Interactive calendar coming soon. Stay tuned for automatic sync with your favorite platforms!</p>
        </div>
      </div>
    </div>
  );
};

export default Contests;
