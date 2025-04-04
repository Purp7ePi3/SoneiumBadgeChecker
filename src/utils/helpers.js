import { DEFAULT_CONTRACTS } from '../constants';

// Validation functions
export function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isContractDuplicate(address, contractsList) {
    return contractsList.some(c => c.address.toLowerCase() === address.toLowerCase());
}

export function validateScanInputs(walletAddress, contracts) {
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

// Media helpers
export function isVideoFile(url) {
    if (!url) return false;
    return url.toLowerCase().endsWith('.mp4') || 
            url.toLowerCase().endsWith('.webm') ||
            url.toLowerCase().includes('media.mp4');
}

// Updated to use public folder for images
export function getLocalImageUrl(contractName) {
    if (!contractName) return '/placeholder.jpg';
    
    const safeFileName = contractName.replace(/[^a-zA-Z0-9]/g, '');
    // Using /images/ folder in the public directory
    return `/images/${safeFileName}.jpg`;
}

export function isDefaultContract(address) {
    return DEFAULT_CONTRACTS.some(
        dc => dc.address.toLowerCase() === address.toLowerCase()
    );
}