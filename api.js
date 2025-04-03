/**
 * API interaction functions for the NFT verification tool
 */

/**
 * Recupera le collezioni NFT per un dato wallet
 * @param {string} walletAddress - Indirizzo del wallet
 * @returns {Promise} Promise che restituisce i dati delle collezioni
 */
async function fetchNFTCollections(walletAddress) {
    const apiUrl = `${API_BASE_URL}/addresses/${walletAddress}/nft/collections?type=${NFT_TYPES}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
}

/**
 * Organizza le collezioni NFT per indirizzo di contratto
 * @param {Object} collectionsData - Dati delle collezioni dall'API
 * @returns {Object} Collezioni organizzate per indirizzo di contratto (lowercase)
 */
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