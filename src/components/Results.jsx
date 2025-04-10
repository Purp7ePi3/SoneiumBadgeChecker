import React, { useState, useEffect } from 'react';
import { BADGE_INFO, DEFAULT_CONTRACTS } from '../constants';
import { isVideoFile, getLocalImageUrl } from '../utils/helpers';
import { IMAGE_PLACEHOLDER } from '../constants';

const Results = ({ contracts, collectionsByContract }) => {
    const [totalBadgesFound, setTotalBadgesFound] = useState(0);
    const [missingBadges, setMissingBadges] = useState([]);
    const [badgesByCollection, setBadgesByCollection] = useState([]);
    const [foundAny, setFoundAny] = useState(false);
    const [totalBadgesPossible, setTotalBadgesPossible] = useState(0);

    useEffect(() => {
        // Calculate total possible badges
        let totalPossibleBadges = 0;
        for (const badgeName in BADGE_INFO) {
            totalPossibleBadges += BADGE_INFO[badgeName].total;
        }
        setTotalBadgesPossible(totalPossibleBadges);
    
        // Reset state before calculations
        let totalFound = 0;
        let missingBadgesArray = [];
        let badgesArray = [];
        let foundAnyFlag = false;
    
        // Process each contract to count badges and identify missing ones
        contracts.forEach(contractObj => {
            const contractAddress = contractObj.address.toLowerCase();
            const collection = collectionsByContract[contractAddress];
            
            // Fix: Ensure the badge name is correctly referenced
            const badgeName = contractObj.name;
            const badgeInfo = BADGE_INFO[badgeName] || { total: 1, description: "Badge" };
    
            // Check for collection based on the new API structure
            const hasTokenInstances = collection && 
                ((collection.token_instances && collection.token_instances.length > 0) || 
                 (collection.total && collection.total.token_instance));
    
            // If collection doesn't exist or doesn't have tokens, it's missing
            if (!hasTokenInstances) {
                missingBadgesArray.push({
                    name: badgeName,
                    count: 0,
                    expected: badgeInfo.total,
                    missing: badgeInfo.total,
                    addy: contractAddress
                });

                // Still add to badges array with count 0
                badgesArray.push({
                    name: badgeName,
                    count: 0,
                    total: badgeInfo.total,
                    addy: contractAddress
                });
                return;
            }
    
            // Found at least one collection
            foundAnyFlag = true;
            
            // Count badges in this collection based on API structure
            let collectionBadgeCount = 0;
            if (collection.token_instances) {
                collectionBadgeCount = collection.token_instances.length;
            } else if (collection.total && collection.total.token_instance) {
                // If we have the new structure, count as 1 token
                collectionBadgeCount = 1;
            }
            
            totalFound += collectionBadgeCount;

            // Use the collection name from API if available, otherwise use the contract name
            let displayName;
            if (collection.token && collection.token.name) {
                displayName = collection.token.name;
            } else if (collection.total && collection.total.token_instance && 
                      collection.total.token_instance.token && 
                      collection.total.token_instance.token.name) {
                displayName = collection.total.token_instance.token.name;
            } else {
                displayName = badgeName;
            }
            
            badgesArray.push({
                name: displayName,
                count: collectionBadgeCount,
                total: badgeInfo.total,
                addy: contractAddress
            });
            
            // If we're missing any badges from this collection
            if (collectionBadgeCount < badgeInfo.total) {
                missingBadgesArray.push({
                    name: displayName,
                    count: collectionBadgeCount,
                    expected: badgeInfo.total,
                    missing: badgeInfo.total - collectionBadgeCount,
                    addy: contractAddress
                });
            }
        });
    
        // Update state with the calculated values
        setMissingBadges(missingBadgesArray);
        setBadgesByCollection(badgesArray);
        setTotalBadgesFound(totalFound);
        setFoundAny(foundAnyFlag);
    
    }, [contracts, collectionsByContract]);
    

    const MissingBadgesSection = () => {
        if (missingBadges.length === 0) return null;
        return (
            <div className="missing-badges">
                <h3>Missing Badges:</h3>
                <ul className="badge-list">
                    {missingBadges.map((badge, index) => (
                        <li key={index}>
                            {badge.name}: {badge.count}/{badge.expected} - {badge.addy}
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
                        ({((totalBadgesFound / totalBadgesPossible) * 100).toFixed(1)}%)
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
            return (
                <div key={contractAddress} className="mt-4">
                    <div className="collection-header">
                        <h3 className="collection-name">
                            {collectionName} - 0/{badgeInfo.total}
                        </h3>
                    </div>
                    <p className="mb-4 text-muted">No tokens found for this collection.</p>
                </div>
            );
        }

        // Determine collection badge count based on API structure
        let collectionBadgeCount = 0;
        if (collection.token_instances) {
            collectionBadgeCount = collection.token_instances.length;
        } else if (collection.total && collection.total.token_instance) {
            collectionBadgeCount = 1;
        }

        // Get collection name based on API structure
        let displayName = collectionName;
        if (collection.token && collection.token.name) {
            displayName = collection.token.name;
        } else if (collection.total && collection.total.token_instance && 
                  collection.total.token_instance.token &&
                  collection.total.token_instance.token.name) {
            displayName = collection.total.token_instance.token.name;
        }

        // Get collection symbol based on API structure
        let symbol = '';
        if (collection.token && collection.token.symbol) {
            symbol = collection.token.symbol;
        } else if (collection.total && collection.total.token_instance && 
                  collection.total.token_instance.token &&
                  collection.total.token_instance.token.symbol) {
            symbol = collection.total.token_instance.token.symbol;
        }

        return (
            <div key={contractAddress}>
                <div className="collection-header mt-4">
                    <h3 className="collection-name">
                        {displayName}
                        {symbol ? ` (${symbol})` : ''} 
                        - {collectionBadgeCount}/{badgeInfo.total}
                    </h3>
                </div>

                {/* Handle the old API structure */}
                {collection.token_instances && collection.token_instances.length > 0 ? (
                    collection.token_instances.map((instance, idx) => (
                        renderNFTItem(instance, displayName, collection, collectionName, contractAddress)
                    ))
                ) : collection.total && collection.total.token_instance ? (
                    // Handle the new API structure
                    renderNFTItem(collection.total.token_instance, displayName, collection, collectionName, contractAddress)
                ) : (
                    <p className="mb-4 text-muted">No tokens found for this collection.</p>
                )}
            </div>
        );
    };

    // Helper function to render an NFT item with consistent handling
    const renderNFTItem = (instance, displayName, collection, collectionName, contractAddress) => {
        const localImageUrl = getLocalImageUrl(displayName || collectionName);
        
        // Get token info based on what API structure provides
        const tokenInfo = instance.token || 
                         (collection.token) || 
                         {name: displayName, address: contractAddress};

        let mediaUrl;
        // Try to determine the best media URL with better IPFS handling
        if (instance.image_url && instance.image_url !== "null" && instance.image_url !== null) {
            // Handle IPFS URLs in different formats
            if (instance.image_url.includes('ipfs://')) {
                const cid = instance.image_url.replace('ipfs://', '');
                mediaUrl = `https://dweb.link/ipfs/${cid}`;
            } else if (instance.image_url.includes('gateway.pinata.cloud/ipfs/')) {
                const cid = instance.image_url.split('gateway.pinata.cloud/ipfs/')[1];
                mediaUrl = `https://dweb.link/ipfs/${cid}`;
            } else if (instance.image_url.includes('ipfs.io/ipfs/')) {
                // Use an alternative gateway since ipfs.io seems to be failing
                const cid = instance.image_url.split('ipfs.io/ipfs/')[1];
                mediaUrl = `https://cloudflare-ipfs.com/ipfs/${cid}`;
            } else {
                mediaUrl = instance.image_url;
            }
        } else if (instance.metadata?.animation_url && 
                instance.metadata.animation_url !== "null" && 
                instance.metadata.animation_url !== null) {
            // Handle animation URLs with IPFS formats
            if (instance.metadata.animation_url.includes('ipfs://')) {
                const cid = instance.metadata.animation_url.replace('ipfs://', '');
                mediaUrl = `https://dweb.link/ipfs/${cid}`;
            } else {
                mediaUrl = instance.metadata.animation_url;
            }
        } else if (instance.metadata?.image && 
                instance.metadata.image !== "null" && 
                instance.metadata.image !== null) {
            // Handle image URLs from metadata with IPFS formats
            if (instance.metadata.image.includes('ipfs://')) {
                const cid = instance.metadata.image.replace('ipfs://', '');
                mediaUrl = `https://dweb.link/ipfs/${cid}`;
            } else if (instance.metadata.image.includes('gateway.pinata.cloud/ipfs/')) {
                const cid = instance.metadata.image.split('gateway.pinata.cloud/ipfs/')[1];
                mediaUrl = `https://dweb.link/ipfs/${cid}`;
            } else if (instance.metadata.image.includes('ipfs.io/ipfs/')) {
                // Use an alternative gateway
                const cid = instance.metadata.image.split('ipfs.io/ipfs/')[1]; 
                mediaUrl = `https://cloudflare-ipfs.com/ipfs/${cid}`;
            } else {
                mediaUrl = instance.metadata.image;
            }
        } else {
            // Immediately use local image if no remote URLs are found
            mediaUrl = localImageUrl || IMAGE_PLACEHOLDER;
        }
                    
        const name = instance.metadata?.name || displayName || collectionName;

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
                                
                                // Try to load from local files based on collection name
                                const collectionIdentifier = displayName || collectionName;
                                const localFallbackUrl = getLocalImageUrl(collectionIdentifier);
                                if (localFallbackUrl) {
                                    e.target.src = localFallbackUrl;
                                } else {
                                    e.target.src = IMAGE_PLACEHOLDER;
                                }
                            }}
                        />
                    )}
                    <div className="nft-details">
                        <h3 className="nft-name">{name}</h3>
                        <p className="token"><strong>Token ID:</strong> {instance.id}</p>
                        <p className="collection-address">{tokenInfo.address}</p>
                        {instance.metadata?.description && (
                            <p className="description">{instance.metadata.description}</p>
                        )}
                    </div>
                </div>
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