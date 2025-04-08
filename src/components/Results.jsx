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
        console.log('Contracts:', contracts);
        console.log('Collections By Contract:', collectionsByContract);
    
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
    
            // If collection doesn't exist, it's missing
            if (!collection || !collection.token_instances || collection.token_instances.length === 0) {
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
            
            // Count badges in this collection
            const collectionBadgeCount = collection.token_instances.length;
            totalFound += collectionBadgeCount;

            // Add to collection badges array with proper naming
            // Use the collection name from API if available, otherwise use the contract name
            const displayName = collection.token.name || badgeName;
            
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
    
        // console.log('Missing Badges:', missingBadgesArray);
        // console.log('Badges By Collection:', badgesArray);
        // console.log('Total Badges Found:', totalFound);
    
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
                            {badge.name}: {badge.count}/{badge.expected} (missing {badge.missing}) 
                            {/* {badge.addy} */}
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

        const collectionBadgeCount = collection.token_instances ? collection.token_instances.length : 0;

        return (
            <div key={contractAddress}>
                <div className="collection-header mt-4">
                    <h3 className="collection-name">
                        {collection.token.name || collectionName}
                        {collection.token.symbol ? ` (${collection.token.symbol})` : ''} 
                        - {collectionBadgeCount}/{badgeInfo.total}
                    </h3>
                </div>

                {collection.token_instances && collection.token_instances.length > 0 ? (
                    collection.token_instances.map((instance, idx) => {
                        const localImageUrl = getLocalImageUrl(collection.token.name || collectionName);

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
                                            
                        const name = instance.metadata?.name || collection.token.name || collectionName;

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
                                                console.log('Image failed to load:', mediaUrl);
                                                e.target.onerror = null; 
                                                
                                                // Try to load from local files based on collection name
                                                const collectionIdentifier = collection.token.name || collectionName;
                                                const localFallbackUrl = getLocalImageUrl(collectionIdentifier);
                                                console.log(localFallbackUrl)
                                                if (localFallbackUrl) {
                                                    console.log('Trying local image:', localFallbackUrl);
                                                    e.target.src = localFallbackUrl;
                                                } else {
                                                    console.log('Using placeholder image');
                                                    e.target.src = IMAGE_PLACEHOLDER;
                                                }
                                            }}
                                        />
                                    )}
                                    <div className="nft-details">
                                        <h3 className="nft-name">{name}</h3>
                                        <p className="token"><strong>Token ID:</strong> {instance.id}</p>
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