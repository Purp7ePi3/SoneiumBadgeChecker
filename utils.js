// Validation functions
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

function isContractDuplicate(address, contractsList) {
    return contractsList.some(c => c.address.toLowerCase() === address.toLowerCase());
}

function validateScanInputs(walletAddress, contracts) {
    if (!walletAddress) {
        return { valid: false, message: 'Please enter a wallet address' };
    }
    
    if (!isValidAddress(walletAddress)) {
        return { valid: false, message: 'Invalid wallet address format' };
    }
    
    if (contracts.length === 0) {
        return { valid: false, message: 'Add at least one contract to scan' };
    }
    
    return { valid: true };
}

// UI Functions
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = message;
    errorDiv.classList.remove('d-none');
}

function hideError() {
    document.getElementById('error').classList.add('d-none');
}

function toggleLoading(show) {
    const loadingElement = document.getElementById('loading');
    if (show) {
        loadingElement.classList.remove('d-none');
    } else {
        loadingElement.classList.add('d-none');
    }
}

// Media helpers
function isVideoFile(url) {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mp4') || 
            url.toLowerCase().endsWith('.webm') ||
            url.toLowerCase().includes('media.mp4');
}

function getLocalImageUrl(contractName) {
    const safeFileName = contractName.replace(/[^a-zA-Z0-9]/g, '');
    return `./${safeFileName}.jpg`;
}

// API Functions
async function fetchNFTCollections(walletAddress) {
    const apiUrl = `${API_BASE_URL}/addresses/${walletAddress}/nft/collections?type=${NFT_TYPES}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
}

async function fetchTokenInfo(contractAddress) {
    const apiUrl = `${API_BASE_URL}/tokens/${contractAddress}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.warn(`Couldn't fetch token info for ${contractAddress}: ${response.status}`);
            return null;
        }
        
        return await response.json();
    } catch (error) {
        console.warn(`Error fetching token info for ${contractAddress}:`, error);
        return null;
    }
}

function organizeCollectionsByContract(collectionsData) {
    if (!collectionsData.items || collectionsData.items.length === 0) {
        return {};
    }
    
    const collectionsByContract = {};
    
    for (const collection of collectionsData.items) {
        if (collection.token && collection.token.address) {
            const contractAddress = collection.token.address.toLowerCase();
            collectionsByContract[contractAddress] = collection;
        }
    }
    
    return collectionsByContract;
}