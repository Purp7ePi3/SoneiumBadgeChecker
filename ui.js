/**
 * UI-related functions for the NFT verification tool
 */

/**
 * Aggiorna la visualizzazione della lista dei contratti
 * @param {Array} contracts - Lista dei contratti
 */
function updateContractsList(contracts) {
    const contractsList = document.getElementById('contractsList');
    contractsList.innerHTML = '';
    
    if (contracts.length === 0) {
        contractsList.innerHTML = '<p>Nessun contratto aggiunto</p>';
        return;
    }
    
    contracts.forEach((contract, index) => {
        const contractDiv = document.createElement('div');
        contractDiv.className = 'contract-item';
        contractDiv.innerHTML = `
            <span class="contract-address">${contract.address}</span>
            <span class="contract-remove" onclick="removeContract(${index})">Rimuovi</span>
        `;
        contractsList.appendChild(contractDiv);
    });
}

/**
 * Mostra un messaggio di errore
 * @param {string} message - Il messaggio di errore da visualizzare
 */
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.innerHTML = message;
    errorDiv.style.display = 'block';
}

/**
 * Nasconde il messaggio di errore
 */
function hideError() {
    document.getElementById('error').style.display = 'none';
}

/**
 * Mostra il loader durante le operazioni asincrone
 * @param {boolean} show - True per mostrare, False per nascondere
 */
function toggleLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

/**
 * Verifica se il file è un video basandosi sull'URL
 * @param {string} url - URL del file
 * @returns {boolean} True se è un video, altrimenti False
 */
function isVideoFile(url) {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mp4') || 
           url.toLowerCase().endsWith('.webm') ||
           url.toLowerCase().includes('media.mp4');
}

/**
 * Crea il contenuto HTML per i risultati della scansione
 * @param {Array} contracts - Lista dei contratti scansionati
 * @param {Object} collectionsByContract - Collezioni NFT organizzate per contratto
 * @param {Object} tokenInfoByContract - Informazioni token per ogni contratto
 * @returns {string} HTML da visualizzare
 */
/**
 * Crea il contenuto HTML per i risultati della scansione, includendo il conteggio dei badge
 * @param {Array} contracts - Lista dei contratti scansionati
 * @param {Object} collectionsByContract - Collezioni NFT organizzate per contratto
 * @returns {string} HTML da visualizzare
 */
function createResultsHTML(contracts, collectionsByContract) {
    let html = `<h2>Risultati della scansione</h2>`;
    let foundAny = false;
    let totalBadges = 0;
    let badgesByCollection = [];
    
    for (const contractObj of contracts) {
        const contractAddress = contractObj.address;
        const matchingCollection = collectionsByContract[contractAddress.toLowerCase()];
        
        if (!matchingCollection) {
            html += `
                <div class="collection-header">
                    <h3 class="collection-name">Nessun NFT trovato</h3>
                    <p class="collection-address">${contractAddress}</p>
                </div>
            `;
            continue;
        }
        
        foundAny = true;
        let collectionBadgeCount = 0;
        
        if (matchingCollection.token_instances && matchingCollection.token_instances.length > 0) {
            collectionBadgeCount = matchingCollection.token_instances.length;
            totalBadges += collectionBadgeCount;
            
            badgesByCollection.push({
                name: matchingCollection.token.name,
                count: collectionBadgeCount
            });
        }
        
        html += `
            <div class="collection-header">
                <h3 class="collection-name">${matchingCollection.token.name} (${collectionBadgeCount} badge)</h3>
                <p class="collection-address">${matchingCollection.token.address}</p>
            </div>
        `;
        
        if (matchingCollection.token_instances && matchingCollection.token_instances.length > 0) {
            for (const instance of matchingCollection.token_instances) {
                const mediaUrl = instance.image_url || IMAGE_PLACEHOLDER;
                const name = instance.metadata?.name || matchingCollection.token.name;
                const externalUrl = instance.external_app_url || 'URL non disponibile';
                
                let mediaElement;
                if (isVideoFile(mediaUrl)) {
                    mediaElement = `
                        <div class="video-container">
                            <video class="nft-video" autoplay loop muted>
                                <source src="${mediaUrl}" type="video/mp4">
                                Il tuo browser non supporta i video.
                            </video>
                        </div>
                    `;
                } else {
                    mediaElement = `<img src="${mediaUrl}" alt="${name}" class="nft-image">`;
                }
                
                html += `
                    <div class="nft-item">
                        <div class="nft-header">
                            ${mediaElement}
                            <div class="nft-details">
                                <h3 class="nft-name">${name}</h3>
                                <p><strong>Token ID:</strong> ${instance.id}</p>
                                <p><strong>URL esterno:</strong> <a href="${externalUrl}" target="_blank" class="nft-url">${externalUrl}</a></p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            html += `<p>Nessun token instance trovato per questa collezione.</p>`;
        }
    }
    
    // Aggiungi il riepilogo con il conteggio totale dei badge
    if (foundAny) {
        html = `
            <div class="badge-summary">
                <h2>Riepilogo Badge</h2>
                <p class="badge-total">Totale badge trovati: <strong>${totalBadges}</strong></p>
                <ul class="badge-list">
                    ${badgesByCollection.map(collection => 
                        `<li>${collection.name}: ${collection.count} badge</li>`).join('')}
                </ul>
            </div>
            ${html}
        `;
    } else {
        html += `
            <p>Nessuno degli indirizzi di contratto specificati ha NFT in questo wallet.</p>
        `;
    }
    
    return html;
}

/**
 * Aggiorna il div dei risultati con il contenuto HTML
 * @param {string} html - HTML da visualizzare nei risultati
 */
function updateResults(html) {
    document.getElementById('results').innerHTML = html;
}