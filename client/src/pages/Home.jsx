// client/src/pages/Home.jsx (Updated for WoW factor)

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-page">
      
      {/* 1. Hero Section (Visual Focus) */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="text-highlight">Found.</span> <span className="text-light">Recover.</span> Connect.
          </h1>
          <p className="hero-subtitle">
            Your centralized hub for Lost & Found items on campus, powered by AI matching.
          </p>
          <div className="hero-cta">
            <Link to="/post" className="btn btn-hero btn-primary">
              <span className="icon-pulse">✨</span> Report Lost or Found Item
            </Link>
            <Link to="/dashboard" className="btn btn-hero btn-secondary">
              Browse All Items
            </Link>
          </div>
        </div>
        <div className="hero-image-placeholder">
          {/*  */}
        </div>
      </section>

      {/* 2. Feature Section */}
      <section className="features-section">
        <h2>How It Works</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>1. Simple Reporting</h3>
            <p>Post items quickly with photos and specific locations. We handle the rest.</p>
          </div>
          <div className="feature-card">
            <h3>2. AI Matching</h3>
            <p>Our intelligent system instantly compares images and descriptions for potential matches.</p>
          </div>
          <div className="feature-card">
            <h3>3. Secure Recovery</h3>
            <p>Receive instant notifications and safely coordinate item retrieval through verified contact.</p>
          </div>
        </div>
      </section>

      {/* 3. Final Call-to-Action */}
      <section className="final-cta">
        <h3>Ready to find your belongings?</h3>
        <Link to="/dashboard" className="btn btn-final-cta btn-success">
          Get Started Now
        </Link>
      </section>
      
    </div>
  );
}

export default Home;