import React from 'react';
import { BADGE_INFO } from '../constants';
import { isVideoFile, getLocalImageUrl } from '../utils/helpers';
import { IMAGE_PLACEHOLDER } from '../constants';

const Results = ({ contracts, collectionsByContract }) => {
    let foundAny = false;
    let totalBadgesFound = 0;
    let totalBadgesPossible = 0;
    let badgesByCollection = [];
    let missingBadges = [];
    
    // Calculate total possible badges
    for (const badgeName in BADGE_INFO) {
        totalBadgesPossible += BADGE_INFO[badgeName].total;
    }

    const MissingBadgesSection = () => {
        if (missingBadges.length === 0) return null;
        
        return (
            <div className="missing-badges">
                <h3>Missing Badges:</h3>
                <ul className="badge-list">
                    {missingBadges.map((badge, index) => (
                        <li key={index}>
                            {badge.name}: {badge.count}/{badge.expected} (missing {badge.missing})
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const BadgeSummary = () => {
        if (foundAny) {
            return (
                <div className="badge-summary">
                    <p className="badge-total">
                        Total Badges Found: {totalBadgesFound}/{totalBadgesPossible} 
                        ({((totalBadgesFound/totalBadgesPossible)*100).toFixed(1)}%)
                    </p>
                    <MissingBadgesSection />
                </div>
            );
        } else {
            return (
                <div className="badge-summary">
                    <p className="badge-total">
                        No NFT badges found in wallet. (0/{totalBadgesPossible} badges)
                    </p>
                </div>
            );
        }
    };

    const NFTCollection = ({ contractObj, collection }) => {
        const contractAddress = contractObj.address;
        const collectionName = contractObj.name;
        const badgeInfo = BADGE_INFO[collectionName] || { total: 1, description: "Badge" };
        
        if (!collection) {
            missingBadges.push({
                name: collectionName,
                count: 0,
                expected: badgeInfo.total,
                missing: badgeInfo.total
            });
            
            return null;
        }
        
        foundAny = true;
        let collectionBadgeCount = 0;
        
        if (collection.token_instances && collection.token_instances.length > 0) {
            collectionBadgeCount = collection.token_instances.length;
            totalBadgesFound += collectionBadgeCount;
            
            const tokenName = collection.token.name;
            badgesByCollection.push({
                name: tokenName,
                count: collectionBadgeCount,
                total: badgeInfo.total
            });
            
            const expected = badgeInfo.total;
            const missing = expected - collectionBadgeCount;
            
            if (missing > 0) {
                missingBadges.push({
                    name: tokenName,
                    count: collectionBadgeCount,
                    expected: expected,
                    missing: missing
                });
            }
        }
        
        return (
            <div key={contractAddress}>
                <div className="collection-header mt-4">
                    <h3 className="collection-name">
                        {collection.token.name}
                        {collection.token.symbol ? ` (${collection.token.symbol})` : ''} 
                        - {collectionBadgeCount}/{badgeInfo.total}
                    </h3>
                </div>
                
                {collection.token_instances && collection.token_instances.length > 0 ? (
                    collection.token_instances.map((instance, idx) => {
                        const localImageUrl = getLocalImageUrl(collection.token.name);
                        
                        let mediaUrl;
                        if (instance.image_url && 
                            instance.image_url !== "null" && 
                            instance.image_url !== null) {
                            mediaUrl = instance.image_url;
                        } else if (instance.metadata?.animation_url && 
                            instance.metadata.animation_url !== "null" && 
                            instance.metadata.animation_url !== null) {
                            mediaUrl = instance.metadata.animation_url;
                        } else {
                            mediaUrl = localImageUrl;
                        }
                        
                        const name = instance.metadata?.name || collection.token.name;
                        
                        return (
                            <div className="nft-item" key={`${contractAddress}-${instance.id}`}>
                                <div className="nft-header">
                                    {isVideoFile(mediaUrl) ? (
                                        <div className="video-container">
                                            <video className="nft-video" autoPlay loop muted>
                                                <source src={mediaUrl} type="video/mp4" />
                                                Your browser does not support video playback.
                                            </video>
                                        </div>
                                    ) : (
                                        <img 
                                            src={mediaUrl} 
                                            alt={name} 
                                            className="nft-image" 
                                            onError={(e) => {
                                                e.target.onerror = null; 
                                                e.target.src = IMAGE_PLACEHOLDER;
                                                e.target.alt = 'NFT image placeholder';
                                            }}
                                        />
                                    )}
                                    <div className="nft-details">
                                        <h3 className="nft-name">{name}</h3>
                                        <p><strong>Token ID:</strong> {instance.id}</p>
                                        <p className="collection-address">{collection.token.address}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="mb-4 text-muted">No tokens found for this collection.</p>
                )}
            </div>
        );
    };

    return (
        <div>
            <h2 className="mt-4 mb-3">Scan Results</h2>
            <BadgeSummary />
            
            {contracts.map((contractObj) => {
                const collection = collectionsByContract[contractObj.address.toLowerCase()];
                return (
                    <NFTCollection 
                        key={contractObj.address} 
                        contractObj={contractObj} 
                        collection={collection} 
                    />
                );
            })}
        </div>
    );
};

export default Results;