import React from 'react';
import { TIP_WALLETS } from '../constants';

const TipCard = ({ showToast }) => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => showToast('Wallet address copied!'))
            .catch(err => {
                console.error('Error copying text: ', err);
                showToast('Failed to copy.');
            });
    };

    return (
        <div className="card shadow-sm mb-4 glow-border">
            <div className="card-body">
                <h2 className="card-title h5 mb-3 glow-text">Tip Me</h2>
                <p className="text-muted small mb-3">Support the development of BadgeChecker by sending a tip.</p>
                <div className="list-group">
                    {TIP_WALLETS.map((wallet, index) => (
                        <div 
                            key={index}
                            className="list-group-item wallet-item"
                            onClick={() => copyToClipboard(wallet.address)}
                        >
                            <span className="wallet-address text-truncate">
                                {wallet.address}
                            </span>
                            <span className="wallet-label">{wallet.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TipCard;