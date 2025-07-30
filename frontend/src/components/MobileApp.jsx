import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Navbar from './Navbar';
import Footer from './Footer';
import '../App.css';

// Import store logos
import playStoreLogo from '../images/play-store.webp'; // Make sure you have these images
import appStoreLogo from '../images/app-store.webp';   // Make sure you have these images

const MobileApp = ({ user, onLogout, onLoginClick }) => {
  // Dummy links for the app stores
  const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.example.tangyleaf';
  const appStoreUrl = 'https://apps.apple.com/us/app/example-tangy-leaf/id1234567890';

  return (
    <>
      <Navbar user={user} onLogout={onLogout} onLoginClick={onLoginClick} />
      <div className="mobile-app-container">
        <div className="app-header">
          <h1>Get The Tangy Leaf on the Go!</h1>
          <p>Order your favorites, find locations, and get exclusive deals with our mobile app.</p>
        </div>
        <div className="app-download-section">
          {/* Android Card */}
          <div className="app-card android-card">
            <div className="qr-code-container">
              <QRCodeSVG value={playStoreUrl} size={160} bgColor="#ffffff" fgColor="#000000" level="H" />
            </div>
            <div className="app-info">
              <h2>Get it on Android</h2>
              <p>Scan the QR code with your camera or click the button below to download from the Google Play Store.</p>
              <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="store-button">
                <img src={playStoreLogo} alt="Google Play Store" />
              </a>
            </div>
          </div>

          {/* iOS Card */}
          <div className="app-card ios-card">
            <div className="qr-code-container">
              <QRCodeSVG value={appStoreUrl} size={160} bgColor="#ffffff" fgColor="#000000" level="H" />
            </div>
            <div className="app-info">
              <h2>Download for iOS</h2>
              <p>Scan the QR code with your camera or click the button below to download from the Apple App Store.</p>
              <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="store-button">
                <img src={appStoreLogo} alt="Apple App Store" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MobileApp;
