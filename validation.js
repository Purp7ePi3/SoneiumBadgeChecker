/**
 * Validation functions for the NFT verification tool
 */

/**
 * Verifica se un indirizzo Ethereum è valido
 * @param {string} address - L'indirizzo da validare
 * @returns {boolean} True se l'indirizzo è valido, altrimenti False
 */
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Verifica se un indirizzo di contratto è già presente nella lista
 * @param {string} address - L'indirizzo da verificare
 * @param {Array} contractsList - Lista di contratti da controllare
 * @returns {boolean} True se l'indirizzo è già presente, altrimenti False
 */
function isContractDuplicate(address, contractsList) {
    return contractsList.some(c => c.address.toLowerCase() === address.toLowerCase());
}

/**
 * Controlla se i campi input sono validi prima di eseguire la scansione
 * @param {string} walletAddress - Indirizzo del wallet
 * @param {Array} contracts - Lista dei contratti da scansionare
 * @returns {Object} Un oggetto con status e message
 */
function validateScanInputs(walletAddress, contracts) {
    if (!walletAddress) {
        return { valid: false, message: 'Inserisci un indirizzo wallet valido' };
    }
    
    if (!isValidAddress(walletAddress)) {
        return { valid: false, message: 'Indirizzo wallet non valido' };
    }
    
    if (contracts.length === 0) {
        return { valid: false, message: 'Aggiungi almeno un contratto NFT da scansionare' };
    }
    
    return { valid: true };
}