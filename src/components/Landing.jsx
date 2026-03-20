import { ArrowRight, Code, Trophy, Zap, Users, ShieldCheck, Mail, Github, Linkedin, Globe } from 'lucide-react';

const Landing = ({ onEnter }) => {
  return (
    <div className="landing-page animate-v3">
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="hero-content">
          <div className="platform-tag">Version 3.0 is Live</div>
          <h1 className="hero-title">Master the Art of <span className="gradient-text">Coding</span></h1>
          <p className="hero-subtitle">
            One platform to rule them all. CodeQuest brings challenges from LeetCode, 
            CodeChef, HackerRank, and more under one powerful dashboard.
          </p>
          <div className="hero-btns">
            <button className="btn-primary-large" onClick={onEnter}>
              Launch Platform <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large">View Documentation</button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="visual-card">
            <div className="vc-header">
               <div className="vc-dots"><span></span><span></span><span></span></div>
               <div className="vc-title">question.js</div>
            </div>
            <div className="vc-body">
               <pre><code>{`function solve(problem) {
  const result = problem.optimize();
  return result.status === 'success' 
    ? "Accepted" 
    : "Try Again";
}`}</code></pre>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-landing">
        <div className="stat-box-l">
           <span className="sl-val">4000+</span>
           <span className="sl-label">Global Questions</span>
        </div>
        <div className="stat-box-l">
           <span className="sl-val">50+</span>
           <span className="sl-label">Live Contests</span>
        </div>
        <div className="stat-box-l">
           <span className="sl-val">10k+</span>
           <span className="sl-label">Active Users</span>
        </div>
      </section>

      {/* Features */}
      <section className="features-landing">
        <h2 className="section-title-l">Why Choose <span className="gradient-text">CodeQuest</span>?</h2>
        <div className="features-grid-l">
          <div className="feature-card-l">
            <div className="fc-icon"><Code /></div>
            <h3>Multi-Platform Hub</h3>
            <p>Access curated problems from HackerRank, LeetCode, CodeForces and more in one unified interface.</p>
          </div>
          <div className="feature-card-l">
            <div className="fc-icon"><Trophy /></div>
            <h3>Real-time Contests</h3>
            <p>Track live programming contests across the globe and never miss an opportunity to compete.</p>
          </div>
          <div className="feature-card-l">
            <div className="fc-icon"><Zap /></div>
            <h3>Premium Stats</h3>
            <p>Deep-dive into your progress with advanced analytics and difficulty-wise completion tracking.</p>
          </div>
          <div className="feature-card-l">
            <div className="fc-icon"><ShieldCheck /></div>
            <h3>Verified Solutions</h3>
            <p>Access high-quality, optimized solutions for complex algorithmic challenges.</p>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="powered-by">
        <h3>Powering Developers Across All Platforms</h3>
        <div className="platforms-logos">
           <div className="p-logo">HackerRank</div>
           <div className="p-logo">LeetCode</div>
           <div className="p-logo">CodeChef</div>
           <div className="p-logo">Codeforces</div>
           <div className="p-logo">GeeksforGeeks</div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="creator-section">
        <div className="creator-card">
           <div className="creator-image">
             <img src="/devansh.jpg" alt="Devansh Maheshwari" />
           </div>
           <div className="creator-text">
             <h4>The Visionary Behind CodeQuest</h4>
             <h2>Devansh Maheshwari</h2>
             <p>A passionate full-stack developer and competitive programmer building tools that empower the next generation of engineers.</p>
             <div className="creator-links">
               <a href="https://github.com/devansh-g10" target="_blank" rel="noreferrer"><Github size={20} /></a>
               <a href="https://www.linkedin.com/in/devansh-maheshwari-59b46a219/" target="_blank" rel="noreferrer"><Linkedin size={20} /></a>
               <a href="mailto:devanshmaheshwari3011@gmail.com"><Mail size={20} /></a>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">CODEQUEST <span>V3.0</span></div>
          <p>&copy; 2026 CodeQuest Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
