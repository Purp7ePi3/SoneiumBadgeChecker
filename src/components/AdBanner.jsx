import React from 'react';

const AdBanner = () => {
    return (
        <div className="ad-banner-container">
            <div className="ad-banner">
                <p className="ad-label">Advertisement</p>
                <div className="ad-content">
                    <img 
                        src="/api/placeholder/120/600" 
                        alt="Advertisement" 
                        className="ad-image"
                    />
                </div>
                <p className="ad-disclaimer">Support BadgeChecker by viewing our ads</p>
            </div>
        </div>
    );
};

export default AdBanner;