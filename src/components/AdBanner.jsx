import React, { useEffect, useRef } from 'react';

const AdBanner = () => {
    const adContainerRef = useRef(null);

    useEffect(() => {
        // Ensure the container is properly sized before loading ads
        const loadAd = () => {
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
        };

        // Small delay to ensure container is properly rendered with correct width
        const timer = setTimeout(loadAd, 100);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="ad-banner-container" style={{ minWidth: '120px' }}>
            <div className="ad-banner">
                <p className="ad-label">Advertisement</p>
                <div className="ad-content" ref={adContainerRef} style={{ minWidth: '120px' }}>
                    {/* Google AdSense ad unit */}
                    <ins className="adsbygoogle"
                        style={{
                            display: 'block',
                            width: '120px',
                            height: '600px'
                        }}
                        data-ad-client="ca-pub-6225458130613974"
                        data-ad-slot="2328021100"
                        data-ad-format="vertical"
                        data-full-width-responsive="false">
                    </ins>
                    
                    {/* Fallback image when AdSense is not loaded or blocked */}
                    <img 
                        src="/api/placeholder/120/600" 
                        alt="Advertisement" 
                        className="ad-image fallback-ad"
                        style={{ display: 'none' }}
                        onError={(e) => {
                            e.target.style.display = 'block';
                        }}
                    />
                </div>
                <p className="ad-disclaimer">Support BadgeChecker by viewing our ads</p>
            </div>
        </div>
    );
};

export default AdBanner;