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
        contractsList.innerHTML = '<p>Any contract added</p>';
        return;
    }
    
    contracts.forEach((contract, index) => {
        const contractDiv = document.createElement('div');
        contractDiv.className = 'contract-item';
        contractDiv.innerHTML = `
            <span class="contract-address">${contract.address}</span>
            <span class="contract-remove" onclick="removeContract(${index})">Remove</span>
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
 * Ottiene l'URL dell'immagine locale basata sul nome del contratto
 * @param {string} contractName - Nome del contratto 
 * @returns {string} URL dell'immagine locale
 */
function getLocalImageUrl(contractName) {
    // Strip special characters and spaces for filename safety
    const safeFileName = contractName.replace(/[^a-zA-Z0-9]/g, '');
    return `./${safeFileName}.jpg`;
}

/**
 * Crea il contenuto HTML per i risultati della scansione, includendo il conteggio dei badge
 * e informazioni sui badge mancanti
 * @param {Array} contracts - Lista dei contratti scansionati
 * @param {Object} collectionsByContract - Collezioni NFT organizzate per contratto
 * @returns {string} HTML da visualizzare
 */
function createResultsHTML(contracts, collectionsByContract) {
    let html = `<h2>Results</h2>`;
    let foundAny = false;
    let totalBadges = 0;
    let badgesByCollection = [];
    let missingBadges = [];
    
    // Define expected badge counts for specific collections
    const expectedBadgeCounts = {
        'Owlto badge': 6,
        'Orbiter': 2
    };
    
    for (const contractObj of contracts) {
        const contractAddress = contractObj.address;
        const matchingCollection = collectionsByContract[contractAddress.toLowerCase()];
        const collectionName = contractObj.name;
        
        if (!matchingCollection) {
            html += `
                <div class="collection-header">
                    <h3 class="collection-name">${collectionName} (Missing NFT)</h3>
                    <p class="collection-address">${contractAddress}</p>
                </div>
            `;
            
            // Add to missing badges if it's one of the ones we're tracking
            if (expectedBadgeCounts[collectionName]) {
                missingBadges.push({
                    name: collectionName,
                    count: 0,
                    expected: expectedBadgeCounts[collectionName],
                    missing: expectedBadgeCounts[collectionName]
                });
            }
            continue;
        }
        
        foundAny = true;
        let collectionBadgeCount = 0;
        
        if (matchingCollection.token_instances && matchingCollection.token_instances.length > 0) {
            collectionBadgeCount = matchingCollection.token_instances.length;
            totalBadges += collectionBadgeCount;
            
            const tokenName = matchingCollection.token.name;
            badgesByCollection.push({
                name: tokenName,
                count: collectionBadgeCount
            });
            
            // Check if this is one of the collections we're tracking for missing badges
            if (expectedBadgeCounts[tokenName]) {
                const expected = expectedBadgeCounts[tokenName];
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
        }
        
        html += `
            <div class="collection-header">
                <h3 class="collection-name">${matchingCollection.token.name} (${matchingCollection.token.symbol})</h3>
                <p class="collection-address">${matchingCollection.token.address}</p>
            </div>
        `;
        
        if (matchingCollection.token_instances && matchingCollection.token_instances.length > 0) {
            for (const instance of matchingCollection.token_instances) {
                // Get local image URL based on contract name
                const localImageUrl = getLocalImageUrl(matchingCollection.token.name);
                
                // Check for animation_url first, then fall back to image_url, then local image
                let mediaUrl;
                
                if (instance.metadata?.animation_url && 
                    instance.metadata.animation_url !== "null" && 
                    instance.metadata.animation_url !== null) {
                    // Use animation URL if available
                    mediaUrl = instance.metadata.animation_url;
                } else if (instance.image_url && 
                           instance.image_url !== "null" && 
                           instance.image_url !== null) {
                    // Use image URL if available
                    mediaUrl = instance.image_url;
                } else {
                    // Use local image file based on contract name
                    mediaUrl = localImageUrl;
                }
                
                const name = instance.metadata?.name || matchingCollection.token.name;
                
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
                    mediaElement = `<img src="${mediaUrl}" alt="${name}" class="nft-image" onerror="this.onerror=null; this.src='${IMAGE_PLACEHOLDER}';">`;
                }
                
                html += `
                    <div class="nft-item">
                        <div class="nft-header">
                            ${mediaElement}
                            <div class="nft-details">
                                <h3 class="nft-name">${name}</h3>
                                <p><strong>Token ID:</strong> ${instance.id}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        } else {
            html += `<p>Any token found for this collection.</p>`;
        }
    }
    
    // Add the summary with the total badge count and missing badges
    if (foundAny) {
        // Create the missing badges section
        let missingBadgesHTML = '';
        if (missingBadges.length > 0) {
            missingBadgesHTML = `
                <div class="missing-badges">
                    <h3>Missing Badges:</h3>
                    <ul class="badge-list">
                        ${missingBadges.map(badge => 
                            `<li>${badge.name}: ${badge.count}/${badge.expected} (missing ${badge.missing})</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        html = `
            <div class="badge-summary">
                <h2>Badge summary</h2>
                <p class="badge-total">Total Badges: <strong>${totalBadges}</strong></p>
                <ul class="badge-list">
                    ${badgesByCollection.map(collection => 
                        `<li>${collection.name}: ${collection.count} badge</li>`).join('')}
                </ul>
                ${missingBadgesHTML}
            </div>
            ${html}
        `;
    } else {
        html += `
            <p>None of the specified contract addresses have NFTs in this wallet.</p>
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