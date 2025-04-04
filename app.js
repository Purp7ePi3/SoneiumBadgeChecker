/**
 * Main application logic for the NFT verification tool
 */

// Stato globale dell'applicazione
const appState = {
    contracts: [...DEFAULT_CONTRACTS]
};

// Inizializzazione dell'applicazione
window.onload = function() {
    updateContractsList(appState.contracts);
};

/**
 * Aggiunge un nuovo contratto alla lista
 */
function addContract() {
    const contractInput = document.getElementById('contractAddress');
    const contractAddress = contractInput.value.trim();
    
    if (!contractAddress) {
        showError('Inserisci un indirizzo contratto valido');
        return;
    }
    
    if (!isValidAddress(contractAddress)) {
        showError('Indirizzo contratto non valido');
        return;
    }
    
    // Controlla se il contratto è già nella lista
    if (isContractDuplicate(contractAddress, appState.contracts)) {
        showError('Questo contratto è già nella lista');
        return;
    }
    
    appState.contracts.push({ address: contractAddress, name: `NFT #${appState.contracts.length + 1}` });
    updateContractsList(appState.contracts);
    contractInput.value = '';
    
    // Nascondi eventuali errori
    hideError();
}

/**
 * Rimuove un contratto dalla lista
 * @param {number} index - Indice del contratto da rimuovere
 */
function removeContract(index) {
    appState.contracts.splice(index, 1);
    updateContractsList(appState.contracts);
}

/**
 * Esegue la scansione di tutti i contratti
 */
async function scanAllContracts() {
    const walletAddress = document.getElementById('walletAddress').value.trim();
    const resultsDiv = document.getElementById('results');
    
    // Reset UI
    resultsDiv.innerHTML = '';
    hideError();
    
    // Validation
    const validation = validateScanInputs(walletAddress, appState.contracts);
    if (!validation.valid) {
        showError(validation.message);
        return;
    }
    
    // Show loading
    toggleLoading(true);
    
    try {
        // Fetch all NFT collections for the wallet
        const data = await fetchNFTCollections(walletAddress);
        
        if (!data.items || data.items.length === 0) {
            appState.contracts.forEach(contract => {
                resultsDiv.innerHTML += `<h2>${contract.name} (Missing NFT)</h2>
                    <p>Wallet doesn't have this NFT.</p>`;
            });
            toggleLoading(false);
            return;
        }
        
        // Organize collections by contract address
        const collectionsByContract = organizeCollectionsByContract(data);
        
        // Fetch token info for each contract to get total supply
        const tokenInfoByContract = {};
        for (const contract of appState.contracts) {
            const tokenInfo = await fetchTokenInfo(contract.address);
            if (tokenInfo) {
                tokenInfoByContract[contract.address.toLowerCase()] = tokenInfo;
            }
        }
        
        // Generate and display results
        const resultsHTML = createResultsHTML(appState.contracts, collectionsByContract, tokenInfoByContract);
        updateResults(resultsHTML);
        
    } catch (error) {
        console.error("Error scanning NFTs:", error);
        showError(`Error scanning NFTs: ${error.message}`);
    } finally {
        toggleLoading(false);
    }
}

// Aggiungi un evento di clic su tutti gli elementi con la classe "wallet-address"
document.querySelectorAll('.wallet-address').forEach(item => {
    item.addEventListener('click', () => {
        const text = item.innerText;
        navigator.clipboard.writeText(text)
            .then(() => {
                alert('Wallet address copied to clipboard');
            })
            .catch(err => {
                console.error('Error copying text: ', err);
            });
    });
});
