import React from 'react';

const AboutCard = () => {
    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="card-title h5 mb-3">About BadgeChecker</h2>
                <p className="text-muted mb-3">
                    BadgeChecker is a simple tool to check if a wallet address holds specific NFT badges 
                    from various Soneium blockchain projects.
                </p>
                <div className="d-flex flex-column gap-2">
                    <div>
                        <h3 className="h6 mb-1">How to use:</h3>
                        <ol className="ps-3 mb-3">
                            <li>Enter a wallet address</li>
                            <li>Add custom contract addresses (optional)</li>
                            <li>Click "Scan Wallet" to check badges</li>
                        </ol>
                    </div>
                    <div>
                        <h3 className="h6 mb-1">Features:</h3>
                        <ul className="ps-3 mb-0">
                            <li>Scans for NFT badges from multiple collections</li>
                            <li>Shows detailed badge information</li>
                            <li>Calculates badge collection progress</li>
                            <li>Shows missing badges</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-3 pt-3 border-top">
                    <p className="text-muted small mb-0">
                        Created with ♥ for the Soneium community.
                        <br />
                        <a href="https://github.com/badgechecker/app" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            View on GitHub
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutCard;