import { useState, useMemo, useEffect, useRef } from 'react';
import { Trophy, Clock, ExternalLink, Calendar, Filter, Zap, LayoutGrid, Bell, Info, Share2, Star } from 'lucide-react';

const Contests = () => {
  const [activePlatform, setActivePlatform] = useState('All');
  const [selectedDay, setSelectedDay] = useState(null); // null = show all
  const [toast, setToast] = useState({ show: false, message: '' });
  const listRef = useRef(null);

  const [contests] = useState([
    {
      id: 1,
      title: "Weekly Contest 389",
      platform: "LeetCode",
      url: "https://leetcode.com/contest/weekly-contest-389",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      duration: "1h 30m",
      status: "Upcoming",
      prize: "500 Tokens",
      color: "#ffa116",
      difficulty: "Global",
      contestantCount: "12k+",
      eventDay: 29
    },
    {
      id: 2,
      title: "Biweekly Contest 126",
      platform: "LeetCode",
      url: "https://leetcode.com/contest/biweekly-contest-126",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
      duration: "1h 30m",
      status: "Upcoming",
      prize: "300 Tokens",
      color: "#ffa116",
      difficulty: "Advanced",
      contestantCount: "8k+",
      eventDay: 27
    },
    {
      id: 3,
      title: "Starters 125 (Div 1 & 2)",
      platform: "CodeChef",
      url: "https://www.codechef.com/START125",
      startTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      duration: "2h",
      status: "Live",
      prize: "Rating Boost",
      color: "#9d7c6b",
      difficulty: "Multi-Div",
      contestantCount: "11k+",
      eventDay: 27
    },
    {
      id: 4,
      title: "ProjectEuler+ Challenges",
      platform: "HackerRank",
      url: "https://www.hackerrank.com/contests/projecteuler/challenges",
      startTime: "Anytime",
      duration: "Self-Paced",
      status: "Ongoing",
      prize: "Gold Medal",
      color: "#2ec866",
      difficulty: "Math-Hard",
      contestantCount: "45k+",
      eventDay: null
    },
    {
      id: 5,
      title: "Codeforces Round 930 (Div 2)",
      platform: "Codeforces",
      url: "https://codeforces.com/contest/1930",
      startTime: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
      duration: "2h",
      status: "Upcoming",
      prize: "Global Rank",
      color: "#3b82f6",
      difficulty: "Div 2",
      contestantCount: "25k+",
      eventDay: 29
    }
  ]);

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleShare = async (contest) => {
    const shareData = {
      title: contest.title,
      text: `Join me for ${contest.title} on ${contest.platform}! 🚀`,
      url: contest.url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        showToast('📋 Link copied to clipboard!');
      }
    } catch (err) {
      // User cancelled share — no action needed
    }
  };

  const [reminders, setReminders] = useState({});

  const toggleReminder = (id) => {
    const isNowReminded = !reminders[id];
    setReminders(prev => ({ ...prev, [id]: isNowReminded }));
    showToast(isNowReminded ? "Notification set! We'll alert you 10 mins before." : "Reminder removed.");
  };

  const platforms = ['All', ...new Set(contests.map(c => c.platform))];

  const filteredContests = useMemo(() => {
    let result = contests;
    if (activePlatform !== 'All') {
      result = result.filter(c => c.platform === activePlatform);
    }
    // Only filter by day when a specific date is selected
    if (selectedDay !== null) {
      const dayHasEvents = contests.some(c => c.eventDay === selectedDay);
      if (dayHasEvents) {
        result = result.filter(c => c.eventDay === selectedDay || c.status === 'Ongoing');
      }
    }
    return result;
  }, [activePlatform, selectedDay, contests]);

  const featuredContest = useMemo(() => {
      return contests.find(c => c.status === 'Live') || contests[0];
  }, [contests]);

  // Countdown Logic Component
  const Countdown = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
      if (targetDate === 'Anytime') {
        setTimeLeft('PERPETUAL');
        return;
      }

      const timer = setInterval(() => {
        const now = new Date().getTime();
        const target = new Date(targetDate).getTime();
        const difference = target - now;

        if (difference < 0 && Math.abs(difference) < (1000 * 60 * 60 * 2)) {
          setTimeLeft('LIVE NOW');
          return;
        } else if (difference < 0) {
           setTimeLeft('ENDED');
           return;
        }

        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft(`${h}h ${m}m ${s}s`);
      }, 1000);

      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className="countdown-timer">
        <Zap size={14} className={timeLeft === 'LIVE NOW' ? 'pulse-zap' : ''} />
        <span>{timeLeft}</span>
      </div>
    );
  };

  const handleDayClick = (day) => {
      setSelectedDay(day);
      const eventsOnDay = contests.filter(c => c.eventDay === day).length;
      if (eventsOnDay > 0) {
          showToast(`Filtered: ${eventsOnDay} event${eventsOnDay > 1 ? 's' : ''} on March ${day}`);
          if (listRef.current) listRef.current.scrollIntoView({ behavior: 'smooth' });
      } else {
          showToast(`No specific events for March ${day}`);
      }
  };

  return (
    <div className="contests-page animate-v3">
      {toast.show && (
        <div className="contest-toast">
          <Info size={16} />
          <span>{toast.message}</span>
        </div>
      )}
      
      <div className="contests-overlay"></div>
      
      <header className="page-header advanced-contest-header">
        <div className="header-badge">GLOBAL CONTEST HUB</div>
        <div className="header-info">
          <h1>Competitive Arena</h1>
          <p>Real-time analytics and upcoming challenges across all major competitive platforms.</p>
        </div>
        <div className="contest-search-v3">
           <Filter size={18} />
           <div className="platform-badges">
             {platforms.map(p => (
               <button 
                key={p} 
                className={`platform-pill ${activePlatform === p ? 'active' : ''}`}
                onClick={() => {
                    setActivePlatform(p);
                    setSelectedDay(null); // Reset day filter when platform changes
                }}
               >
                 {p}
               </button>
             ))}
           </div>
        </div>
      </header>

      {/* Featured Banner Section */}
      <div className="featured-banner-v3 animate-v3">
         <div className="featured-card">
            <div className="f-badge"><Star size={12} fill="currentColor" /> FEATURED CHALLENGE</div>
            <div className="f-content">
               <div className="f-left">
                  <h2>{featuredContest.title}</h2>
                  <div className="f-meta">
                     <span className="p-tag" style={{ borderLeft: `4px solid ${featuredContest.color}` }}>{featuredContest.platform}</span>
                     <span className="d-tag">{featuredContest.difficulty}</span>
                  </div>
                  <p>Highest engagement today. Join over {featuredContest.contestantCount} engineers globally.</p>
                  <div className="f-actions">
                      <button className="f-enter-btn" onClick={() => window.open(featuredContest.url, '_blank', 'noopener,noreferrer')}>ENTER ARENA</button>
                      <button className="f-share-btn" onClick={() => handleShare(featuredContest)} title="Share this contest"><Share2 size={18} /></button>
                  </div>
               </div>
               <div className="f-right">
                  <div className="countdown-wrapper">
                    <span className="label">Next Milestone In:</span>
                    <Countdown targetDate={featuredContest.startTime} />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="contest-stats-row" ref={listRef}>
        <div className="mini-stat clickable" onClick={() => setActivePlatform('All')}>
          <span className="label">Total Scope</span>
          <span className="value">{contests.length}</span>
        </div>
        <div className="mini-stat">
          <span className="label">Active Engineers</span>
          <span className="value">104k+</span>
        </div>
        <div className="mini-stat">
          <span className="label">Selection Focus</span>
          <span className="value">{selectedDay ? `Mar ${selectedDay}` : 'All Dates'}</span>
        </div>
      </div>

      <div className="contest-grid premium-grid">
        {filteredContests.map(contest => (
          <div key={contest.id} className={`contest-card-v3 ${contest.status.toLowerCase()}`}>
            <div className="card-glimmer"></div>
            
            <div className="contest-card-header">
              <div className="platform-info">
                <span className="platform-dot" style={{ background: contest.color }}></span>
                <span className="platform-name">{contest.platform}</span>
              </div>
              <div className="difficulty-tag">{contest.difficulty}</div>
            </div>
            
            <h3 className="contest-title-v3">{contest.title}</h3>
            
            <div className="contest-perks">
              <div className="perk">
                <LayoutGrid size={14} />
                <span>{contest.contestantCount} Registered</span>
              </div>
              <div className="perk prize">
                <Trophy size={14} />
                <span>{contest.prize}</span>
              </div>
            </div>

            <div className="contest-footer-v3">
              <div className="timeline-info">
                <Countdown targetDate={contest.startTime} />
                <div className="duration-tag">
                    <Clock size={12} /> {contest.duration}
                </div>
              </div>
              
              <div className="action-buttons-v3">
                <button 
                  className={`reminder-btn ${reminders[contest.id] ? 'active' : ''}`}
                  onClick={() => toggleReminder(contest.id)}
                  title="Notify Me"
                >
                  <Bell size={18} />
                </button>
                <button className="join-btn-v3" onClick={() => window.open(contest.url, '_blank', 'noopener,noreferrer')}>
                  Enter <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredContests.length === 0 && (
             <div className="no-event-placeholder">
                <Zap size={48} opacity={0.1} />
                <p>No matches for this date. Check another day or clear filters.</p>
                <button className="platform-pill active" onClick={() => {setSelectedDay(null); setActivePlatform('All');}}>Reset All</button>
             </div>
        )}
      </div>

      <div className="contest-calendar-section-v3">
        <div className="section-intro">
          <h2>Master Calendar</h2>
          <p>Click highlighted dates to automatically filter challenges for that specific day.</p>
          <div className="cal-legend">
             <div className="leg-item"><span className="dot event"></span> Event Day</div>
             <div className="leg-item"><span className="dot today"></span> Today</div>
          </div>
        </div>
        <div className="calendar-widget-v3">
          <div className="cal-header">
             <div className="month">March 2024</div>
             <div className="controls">
                <span>&lt;</span>
                <span>&gt;</span>
             </div>
          </div>
          <div className="cal-days">
            {['S','M','T','W','T','F','S'].map(d => <div key={d} className="day-name">{d}</div>)}
            {[...Array(31)].map((_, i) => {
              const dayNum = i + 1;
              const dayEvents = contests.filter(c => c.eventDay === dayNum);
              const isEvent = dayEvents.length > 0;
              const isToday = dayNum === 27;
              const isSelected = dayNum === selectedDay;

              return (
                <div 
                  key={i} 
                  className={`day-cell ${isEvent ? 'event' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleDayClick(dayNum)}
                >
                  {dayNum}
                  {isEvent && (
                      <div className="platform-dots-mini">
                          {dayEvents.map(e => (
                              <span key={e.id} className="mini-dot" style={{ background: e.color }}></span>
                          ))}
                      </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="cal-info">
             <div className="next-event">
                <Zap size={14} color="var(--accent-blue)" />
                <span>Next major event: <strong>March 29</strong> (Weekly 389)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contests;
