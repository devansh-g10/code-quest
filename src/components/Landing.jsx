import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Code, Trophy, Zap, ShieldCheck, Mail, Github, Linkedin, Globe, X, Book, ChevronRight, Files } from 'lucide-react';

const Landing = ({ onEnter, onNavigate }) => {
  const [showDocs, setShowDocs] = useState(false);
  const landingRef = useRef(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const handleComingSoon = (feature) => {
    alert(`${feature} is currently under development. Stay tuned!`);
  };

  const DocumentationPanel = () => (
    <div className={`docs-overlay ${showDocs ? 'active' : ''}`}>
      <div className="docs-panel animate-slide-in">
        <header className="docs-header">
          <div className="dh-left">
            <Book size={20} />
            <h3>Developer Portal</h3>
          </div>
          <button className="close-docs" onClick={() => setShowDocs(false)}><X size={24} /></button>
        </header>

        <div className="docs-body">
          <div className="docs-section">
            <h4 className="docs-title"><ChevronRight size={16} /> Getting Started</h4>
            <p>Welcome to CodeQuest 3.0. Here's a quick guide to mastering your coding journey.</p>
            <div className="docs-code-box">
              <code>{`npm install @codequest/cli -g
codequest login`}</code>
            </div>
          </div>

          <div className="docs-section">
            <h4 className="docs-title"><ChevronRight size={16} /> API Integration</h4>
            <p>Access our universal challenge database directly from your own applications via the GraphQL endpoint.</p>
            <span className="docs-link">View full API specs →</span>
          </div>

          <div className="docs-section">
            <h4 className="docs-title"><ChevronRight size={16} /> Competitive Hub</h4>
            <p>Learn how to connect your LeetCode, CodeChef, and HackerRank accounts for real-time tracking.</p>
            <div className="docs-info-card">
              <Files size={18} />
              <span>Version: Stable.v3.10.4</span>
            </div>
          </div>
        </div>

        <footer className="docs-footer">
          <button className="btn-primary-large" style={{ width: '100%' }} onClick={onEnter}>
            Enter Platform <ArrowRight size={18} />
          </button>
        </footer>
      </div>
    </div>
  );

  return (
    <div className="landing-page animate-v3" ref={landingRef}>
      <div className="mouse-glow-v3" style={{ left: mousePos.x, top: mousePos.y }}></div>
      <DocumentationPanel />
      {/* Background Layer */}
      <div className="bg-float-dots"></div>
      <div className="bg-glow-orb orb-1"></div>
      <div className="bg-glow-orb orb-2"></div>
      <div className="bg-glow-orb orb-3" style={{ bottom: '20%', right: '10%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)' }}></div>
      
      {/* Hero Section */}
      <section className="hero-landing">
        <div className="hero-content reveal">
          <div className="platform-tag glimmer-box">Version 3.0 is Live</div>
          <h1 className="hero-title">Master the Art of <span className="gradient-text">Coding</span></h1>
          <p className="hero-subtitle">
            One platform to rule them all. CodeQuest brings challenges from LeetCode, 
            CodeChef, HackerRank, and more under one powerful dashboard.
          </p>
          <div className="hero-btns">
            <button className="btn-primary-large glimmer-box" onClick={onEnter}>
              Launch Platform <ArrowRight size={20} />
            </button>
            <button className="btn-secondary-large glass-premium" onClick={() => setShowDocs(true)}>View Documentation</button>
          </div>
        </div>
        <div className="hero-visual reveal reveal-delay-2">
          <div className="visual-card glass-premium">
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
      <section className="stats-landing reveal">
        <div className="stat-box-l glimmer-box">
           <span className="sl-val">4000+</span>
           <span className="sl-label">Global Questions</span>
        </div>
        <div className="stat-box-l glimmer-box">
           <span className="sl-val">50+</span>
           <span className="sl-label">Live Contests</span>
        </div>
        <div className="stat-box-l glimmer-box">
           <span className="sl-val">10k+</span>
           <span className="sl-label">Active Users</span>
        </div>
      </section>

      {/* Features */}
      <section className="features-landing">
        <h2 className="section-title-l reveal">Why Choose <span className="gradient-text">CodeQuest</span>?</h2>
        <div className="features-grid-l">
          <div className="feature-card-l reveal reveal-delay-1 glass-premium glimmer-box">
            <div className="fc-icon"><Code /></div>
            <h3>Multi-Platform Hub</h3>
            <p>Access curated problems from HackerRank, LeetCode, CodeForces and more in one unified interface.</p>
          </div>
          <div className="feature-card-l reveal reveal-delay-2 glass-premium glimmer-box">
            <div className="fc-icon"><Trophy /></div>
            <h3>Real-time Contests</h3>
            <p>Track live programming contests across the globe and never miss an opportunity to compete.</p>
          </div>
          <div className="feature-card-l reveal reveal-delay-3 glass-premium glimmer-box">
            <div className="fc-icon"><Zap /></div>
            <h3>Premium Stats</h3>
            <p>Deep-dive into your progress with advanced analytics and difficulty-wise completion tracking.</p>
          </div>
          <div className="feature-card-l reveal reveal-delay-1 glass-premium glimmer-box">
            <div className="fc-icon"><ShieldCheck /></div>
            <h3>Verified Solutions</h3>
            <p>Access high-quality, optimized solutions for complex algorithmic challenges.</p>
          </div>
        </div>
      </section>

      {/* Powered By Section */}
      <section className="powered-by reveal">
        <h3>Powering Developers Across All <span className="gradient-text">Platforms</span></h3>
        <div className="platforms-logos reveal reveal-delay-2">
           <a href="https://www.hackerrank.com" target="_blank" rel="noreferrer" className="p-logo">HackerRank</a>
           <a href="https://leetcode.com" target="_blank" rel="noreferrer" className="p-logo">LeetCode</a>
           <a href="https://www.codechef.com" target="_blank" rel="noreferrer" className="p-logo">CodeChef</a>
           <a href="https://codeforces.com" target="_blank" rel="noreferrer" className="p-logo">Codeforces</a>
           <a href="https://www.geeksforgeeks.org" target="_blank" rel="noreferrer" className="p-logo">GeeksforGeeks</a>
        </div>
      </section>

      {/* Creator Section */}
      <section className="creator-section reveal">
        <div className="creator-card glass-premium">
           <div className="creator-image glimmer-box">
             <img src="/devansh.jpg" alt="Devansh Maheshwari" />
           </div>
           <div className="creator-text">
             <h4>The Visionary Behind CodeQuest</h4>
             <h2>Devansh Maheshwari</h2>
             <p>A passionate full-stack developer and competitive programmer building tools that empower the next generation of engineers.</p>
             <div className="creator-links">
               <a href="https://github.com/devansh-g10" target="_blank" rel="noreferrer" className="glimmer-box"><Github size={20} /></a>
               <a href="https://www.linkedin.com/in/devansh-maheshwari-59b46a219/" target="_blank" rel="noreferrer" className="glimmer-box"><Linkedin size={20} /></a>
               <a href="https://devanshmaheshwari.com" target="_blank" rel="noreferrer" className="glimmer-box"><Globe size={20} /></a>
               <a href="mailto:devanshmaheshwari3011@gmail.com" className="glimmer-box"><Mail size={20} /></a>
             </div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer reveal">
        <div className="footer-container">
          <div className="footer-main">
            <div className="footer-info">
              <div className="footer-logo">CODEQUEST <span>V3.0</span></div>
              <p className="footer-bio">
                The ultimate destination for competitive programmers. Unified tracking, global challenges, and real-time contest data at your fingertips.
              </p>
              <div className="footer-social-links">
                <a href="https://github.com/devansh-g10" target="_blank" rel="noreferrer"><Github size={18} /></a>
                <a href="https://www.linkedin.com/in/devansh-maheshwari-59b46a219/" target="_blank" rel="noreferrer"><Linkedin size={18} /></a>
                <a href="mailto:devanshmaheshwari3011@gmail.com"><Mail size={18} /></a>
              </div>
            </div>

            <div className="footer-links-column">
              <h4>Navigation</h4>
              <ul>
                <li onClick={onEnter}>Launch App</li>
                <li onClick={() => onNavigate('problems')}>Global Library</li>
                <li onClick={() => onNavigate('contests')}>Live Contests</li>
                <li onClick={() => onNavigate('profile')}>Performance Stats</li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Resources</h4>
              <ul>
                <li onClick={() => handleComingSoon('API Documentation')}>API Documentation</li>
                <li onClick={() => window.open('https://discord.gg/coding', '_blank')}>Discord Community</li>
                <li onClick={() => handleComingSoon('Success Stories')}>Success Stories</li>
                <li onClick={() => handleComingSoon('CodeQuest Blog')}>CodeQuest Blog</li>
              </ul>
            </div>

            <div className="footer-links-column">
              <h4>Legal</h4>
              <ul>
                <li onClick={() => handleComingSoon('Terms of Service')}>Terms of Service</li>
                <li onClick={() => handleComingSoon('Privacy Policy')}>Privacy Policy</li>
                <li onClick={() => handleComingSoon('Cookie Settings')}>Cookie Settings</li>
                <li onClick={() => handleComingSoon('Security Status')}>Security</li>
              </ul>
            </div>
          </div>

          <div className="footer-divider"></div>

          <div className="footer-bottom">
            <p>&copy; 2026 CodeQuest Platform. Built by Devansh Maheshwari. All rights reserved.</p>
            <div className="footer-legal-bar">
              <span onClick={() => handleComingSoon('Language settings')}>English (US)</span>
              <span onClick={() => handleComingSoon('System Status')}>System Status</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
