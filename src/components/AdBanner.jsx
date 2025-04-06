import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
    const adContainerRef = useRef(null);

    useEffect(() => {
        // Only run if window and adsbygoogle exist
        if (typeof window !== 'undefined' && window.adsbygoogle) {
            try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                console.log('AdSense initialized');
            } catch (error) {
                console.error('AdSense error:', error);
            }
        } else {
            console.log('AdSense not available');
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
                        data-ad-slot="1234567890" // Replace with your actual ad slot ID
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