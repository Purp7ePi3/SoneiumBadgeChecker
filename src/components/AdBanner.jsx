import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
    const adContainerRef = useRef(null);

    useEffect(() => {
        // This is where you can initialize Google AdSense ads
        // Only run this if we're in a browser environment and the Google AdSense script is loaded
        if (typeof window !== 'undefined' && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            } catch (error) {
                console.error('AdSense error:', error);
            }
        }
    }, []);

    return (
        <div className="ad-banner-container">
            <div className="ad-banner">
                <p className="ad-label">Advertisement</p>
                <div className="ad-content" ref={adContainerRef}>
                    {/* Google AdSense ad unit */}
                    <ins className="adsbygoogle"
                        style={{
                            display: 'block',
                            width: '120px',
                            height: '600px'
                        }}
                        data-ad-client="ca-pub-6225458130613974"
                        data-ad-slot="your-ad-slot-id" // Replace with your actual ad slot ID
                        data-ad-format="vertical"
                        data-full-width-responsive="true"></ins>
                    
                    {/* Fallback image when AdSense is not loaded or blocked */}
                    <img 
                        src="/api/placeholder/120/600" 
                        alt="Advertisement" 
                        className="ad-image fallback-ad"
                    />
                </div>
                <p className="ad-disclaimer">Support BadgeChecker by viewing our ads</p>
            </div>
        </div>
    );
};

export default AdBanner;