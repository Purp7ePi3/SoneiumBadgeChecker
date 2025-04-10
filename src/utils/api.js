import { API_BASE_URL, NFT_TYPES } from '../constants';

// API Functions
export async function fetchNFTCollections(walletAddress, types = ["ERC-721", "ERC-404", "ERC-1155"]) {
    const results = { items: [] };
    
    for (const type of types) {
        const apiUrl = `${API_BASE_URL}/addresses/${walletAddress}/token-transfers?type=${type}`;
        try {
            const response = await fetch(apiUrl);
            if (response.ok) {
                const data = await response.json();
                // if (type === "ERC-1155") {
                //     // Log all contract addresses for ERC-721 collections
                //     if (data.items && data.items.length > 0) {
                //         data.items.forEach(item => {
                //             if (item.token && item.token.address) {
                //                 console.log("ERC-721 Contract:", item.token.address);
                //             }
                //         });
                //     }
                // }
                if (data.items && data.items.length > 0) {
                    results.items = [...results.items, ...data.items];
                }
            }
        } catch (error) {
            console.warn(`Error fetching ${type} collections:`, error);
        }
    }
    
    return results;
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

// Modify your organizeCollectionsByContract function in api.js

export const organizeCollectionsByContract = (collections) => {
    const organized = {};
    const seen = new Set(); // ✅ nuova struttura per deduplicazione globale

    const process = (collection) => processCollection(collection, organized, seen);

    if (Array.isArray(collections)) {
        collections.forEach(process);
    } else if (collections?.items && Array.isArray(collections.items)) {
        collections.items.forEach(process);
    } else if (collections?.token) {
        process(collections);
    } else if (typeof collections === 'object') {
        Object.values(collections).forEach(item => {
            if (item && typeof item === 'object') {
                process(item);
            }
        });
    }

    return organized;
};

function processCollection(collection, organized, seen) {
    const contractAddress = collection.token?.address?.toLowerCase();
    if (!contractAddress) return;

    const tokenType = collection.token?.type?.toUpperCase();
    const tokenId = collection.total?.token_id?.toString();
    const tokenInstanceId = collection.total?.token_instance?.id?.toString();

    // Chiave univoca globale
    const globalKey = `${contractAddress}-${tokenId || 'noid'}-${tokenInstanceId || 'noinstance'}`;
    if (seen.has(globalKey)) {
        return; // 🔁 Già vista, ignorata
    }
    seen.add(globalKey);

    if (!organized[contractAddress]) {
        organized[contractAddress] = {
            token: collection.token,
            token_instances: [],
            erc1155_tokens: {}
        };
    }

    // Solo se ERC-1155 e token_id presente
    if (tokenType === 'ERC-1155' && tokenId) {
        // Salviamo solo una volta per token_id
        if (!organized[contractAddress].erc1155_tokens[tokenId]) {
            organized[contractAddress].erc1155_tokens[tokenId] = collection;
        }

        const instance = collection.total?.token_instance;
        if (instance?.id) {
            if (!organized[contractAddress].token_instances.some(i => i.id === instance.id)) {
                organized[contractAddress].token_instances.push(instance);
            }
        }
    } else {
        // ERC-721 o altri
        const instances = collection.token_instances || [collection.total?.token_instance];
        instances.forEach(instance => {
            if (instance?.id && !organized[contractAddress].token_instances.some(i => i.id === instance.id)) {
                organized[contractAddress].token_instances.push(instance);
            }
        });
    }
}