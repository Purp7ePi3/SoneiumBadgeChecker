import { API_BASE_URL, NFT_TYPES } from '../constants';

// API Functions
export async function fetchNFTCollections(walletAddress) {
    const apiUrl = `${API_BASE_URL}/addresses/${walletAddress}/nft/collections?type=${NFT_TYPES}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
}

export async function fetchTokenInfo(contractAddress) {
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

export function organizeCollectionsByContract(collectionsData) {
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