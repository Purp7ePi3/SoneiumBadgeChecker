// Configuration constants
const API_BASE_URL = "https://soneium.blockscout.com/api/v2";
const NFT_TYPES = "ERC-721%2CERC-404%2CERC-1155";
const IMAGE_PLACEHOLDER = "/api/placeholder/200/200";

// Default contracts to check
const DEFAULT_CONTRACTS = [
    { address: "0x9d83A657581A966aDf1c346dAfEE3EBe258EC26D", name: "Mithraeum: Badge" },
    { address: "0x7e058E9eeb81758F80049d0F2c1C1A7b47919697", name: "OmniHub" },
    { address: "0x890a19A1Dd75AAEcc4eDFce4685bb59C8ABEe78A", name: "Posse"},
    { address: "0x2A21B17E366836e5FFB19bd47edB03b4b551C89d", name: "OG badge"},
    { address: "0x1eC6AACC79f3c4817d7fea2268e1c54C6b2662Fb", name: "Owlto badge"},
    { address: "0x4591D540B692CBeD60Db7781B7683910f7a3BF8C", name: "NFT2Me"},
    { address: "0x066ABA7c3520e300113C0515FF41c084eE0c95Ea", name: "Sonus"},
    { address: "0x38bD4363b7Cd4040fAC6EEa5eF5d38E934AebD65", name: "CoPump"},
    { address: "0xCA707D22E248740aDaA9C63580F7A35201B18d30", name: "UneWeb"},
    { address: "0x11B2876C58cFb7501Db60d0112AF8A8EfEB0A81D", name: "KyoFinance"},
    { address: "0x3a634e6f8C2bf2C5894722B908d99e3cF9C62eD3", name: "Sake"},
];

// Badge info with total counts
const BADGE_INFO = {
    'Owlto badge': { total: 6, description: "Owlto community badges" },
    'Mithraeum: Badge': { total: 1, description: "Mithraeum participation badge" },
    'OmniHub': { total: 1, description: "OmniHub contributor badge" },
    'Posse': { total: 1, description: "Posse membership badge" },
    'OG badge': { total: 1, description: "Original supporter badge" },
    'NFT2Me': { total: 1, description: "NFT2Me platform badge" },
    'Sonus': { total: 1, description: "Sonus community badge" },
    'CoPump': { total: 1, description: "CoPump project badge" },
    'UneWeb': { total: 1, description: "UneWeb contributor badge" },
    'KyoFinance': { total: 1, description: "KyoFinance community badge" },
    'Sake': { total: 1, description: "Sake protocol badge" }
};

// Global application state
const appState = {
    contracts: [...DEFAULT_CONTRACTS]
};

// Initialize the application
window.onload = function() {
    updateContractsList(appState.contracts);
};

// Contract management
function updateContractsList(contracts) {
    const contractsList = document.getElementById('contractsList');
    if (contractsList) {
        contractsList.innerHTML = '';
        
        if (contracts.length === 0) {
            contractsList.innerHTML = '<p class="p-3 text-muted">No contracts added yet</p>';
            return;
        }
        
        contracts.forEach((contract, index) => {
            const contractDiv = document.createElement('div');
            contractDiv.className = 'list-group-item d-flex justify-content-between align-items-center';
            
            const isDefaultContract = DEFAULT_CONTRACTS.some(
                dc => dc.address.toLowerCase() === contract.address.toLowerCase()
            );
            
            const removeButton = isDefaultContract ? '' : 
                `<button class="btn btn-sm btn-outline-danger" onclick="removeContract(${index})">✕</button>`;
            
            contractDiv.innerHTML = `
                <span class="fw-medium">${contract.name}</span>
                ${removeButton}
            `;
            contractsList.appendChild(contractDiv);
        });
    }
}

function addContract() {
    const contractInput = document.getElementById('contractAddress');
    const contractAddress = contractInput.value.trim();
    
    if (!contractAddress) {
        showError('Please enter a valid contract address');
        return;
    }
    
    if (!isValidAddress(contractAddress)) {
        showError('Invalid contract address format');
        return;
    }
    
    if (isContractDuplicate(contractAddress, appState.contracts)) {
        showError('This contract is already in the list');
        return;
    }
    
    appState.contracts.push({ address: contractAddress, name: `NFT #${appState.contracts.length + 1}` });
    updateContractsList(appState.contracts);
    contractInput.value = '';
    
    hideError();
}

function removeContract(index) {
    appState.contracts.splice(index, 1);
    updateContractsList(appState.contracts);
}

// Results display
function createResultsHTML(contracts, collectionsByContract) {
    let html = `<h2 class="mt-4 mb-3">Scan Results</h2>`;
    let foundAny = false;
    let totalBadgesFound = 0;
    let totalBadgesPossible = 0;
    let badgesByCollection = [];
    let missingBadges = [];
    
    // Calculate total possible badges
    for (const badgeName in BADGE_INFO) {
        totalBadgesPossible += BADGE_INFO[badgeName].total;
    }
    
    for (const contractObj of contracts) {
        const contractAddress = contractObj.address;
        const matchingCollection = collectionsByContract[contractAddress.toLowerCase()];
        const collectionName = contractObj.name;
        const badgeInfo = BADGE_INFO[collectionName] || { total: 1, description: "Badge" };
        
        if (!matchingCollection) {
            missingBadges.push({
                name: collectionName,
                count: 0,
                expected: badgeInfo.total,
                missing: badgeInfo.total
            });
            
            continue;
        }
        
        foundAny = true;
        let collectionBadgeCount = 0;
        
        if (matchingCollection.token_instances && matchingCollection.token_instances.length > 0) {
            collectionBadgeCount = matchingCollection.token_instances.length;
            totalBadgesFound += collectionBadgeCount;
            
            const tokenName = matchingCollection.token.name;
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
        
        html += `
            <div class="collection-header mt-4">
                <h3 class="collection-name">
                ${matchingCollection.token.name}
                ${matchingCollection.token.symbol ? `(${matchingCollection.token.symbol})` : ''} 
                - ${collectionBadgeCount}/${badgeInfo.total}
                </h3>
            </div>
        `;
        
        if (matchingCollection.token_instances && matchingCollection.token_instances.length > 0) {
            for (const instance of matchingCollection.token_instances) {
                const localImageUrl = getLocalImageUrl(matchingCollection.token.name);
                
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
                
                const name = instance.metadata?.name || matchingCollection.token.name;
                
                let mediaElement;
                if (isVideoFile(mediaUrl)) {
                    mediaElement = `
                        <div class="video-container">
                            <video class="nft-video" autoplay loop muted>
                                <source src="${mediaUrl}" type="video/mp4">
                                Your browser does not support video playback.
                            </video>
                        </div>
                    `;                
                } else {
                    mediaElement = `<img src="${mediaUrl}" alt="${name}" class="nft-image" onerror="this.onerror=null; this.src='${IMAGE_PLACEHOLDER}'; this.alt='NFT image placeholder';">`;
                }
                
                html += `
                    <div class="nft-item">
                        <div class="nft-header">
                            ${mediaElement}
                            <div class="nft-details">
                                <h3 class="nft-name">${name}</h3>
                                <p><strong>Token ID:</strong> ${instance.id}</p>
                                <p class="collection-address">${matchingCollection.token.address}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            html += `<p class="mb-4 text-muted">No tokens found for this collection.</p>`;
        }
    }
    
    if (foundAny) {
        let missingBadgesHTML = '';
        if (missingBadges.length > 0) {
            missingBadgesHTML = `
                <div class="missing-badges">
                    <h3>Missing Badges:</h3>
                    <ul class="badge-list">
                        ${missingBadges.map(badge => 
                        `<li>${badge.name}: ${badge.count}/${badge.expected} (missing ${badge.missing})</li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        }
        
        // Add badge collection summary
        html = `
            <div class="badge-summary">
                <p class="badge-total">Total Badges Found: ${totalBadgesFound}/${totalBadgesPossible} (${((totalBadgesFound/totalBadgesPossible)*100).toFixed(1)}%)</p>
                ${missingBadgesHTML}
            </div>
        ` + html;
    } else {
        html = `
            <div class="badge-summary">
                <p class="badge-total">No NFT badges found in wallet. (0/${totalBadgesPossible} badges)</p>
            </div>
        ` + html;
    }
    
    return html;
}

// Main scanning function
async function scanAllContracts() {
    const walletAddressInput = document.getElementById('walletAddress');
    const walletAddress = walletAddressInput.value.trim();
    
    const validation = validateScanInputs(walletAddress, appState.contracts);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    hideError();
    toggleLoading(true);
    
    try {
        const collections = await fetchNFTCollections(walletAddress);
        const collectionsByContract = organizeCollectionsByContract(collections);
        
        const resultsContainer = document.getElementById('results');
        resultsContainer.innerHTML = createResultsHTML(appState.contracts, collectionsByContract);
        
    } catch (error) {
        console.error('Error scanning wallet:', error);
        showError(`Error scanning wallet: ${error.message}`);
    } finally {
        toggleLoading(false);
    }
}