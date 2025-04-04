import React, { useState } from 'react';
import { fetchNFTCollections } from '../utils/api';
import { organizeCollectionsByContract } from '../utils/api';
import { validateScanInputs } from '../utils/helpers';
import Results from './Results';

const BadgeScanner = ({ contracts }) => {
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [collectionsByContract, setCollectionsByContract] = useState({});

    const scanAllContracts = async () => {
        const validation = validateScanInputs(walletAddress, contracts);
        if (!validation.valid) {
            setError(validation.message);
            return;
        }
        
        setError('');
        setLoading(true);
        
        try {
            const collections = await fetchNFTCollections(walletAddress);
            const collectionsByContractData = organizeCollectionsByContract(collections);
            
            setCollectionsByContract(collectionsByContractData);
            setResults(true);
            
        } catch (error) {
            console.error('Error scanning wallet:', error);
            setError(`Error scanning wallet: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-body p-4">
                <h1 className="mb-4">Check NFT Badges</h1>
                
                <div className="mb-3">
                    <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="walletAddress" 
                        placeholder="Enter wallet address (0x...)" 
                        value={walletAddress}
                        onChange={(e) => setWalletAddress(e.target.value)}
                    />
                </div>
                
                <div className="mb-4">
                    <button 
                        className="btn btn-success" 
                        onClick={scanAllContracts}
                        disabled={loading}
                    >
                        Scan Wallet
                    </button>             
                </div>
                
                {loading && (
                    <div className="text-center text-primary">
                        <div className="spinner-border me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <span>Scanning wallet contents...</span>
                    </div>
                )}
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                
                {results && !loading && (
                    <Results 
                        contracts={contracts} 
                        collectionsByContract={collectionsByContract} 
                    />
                )}
            </div>
        </div>
    );
};

export default BadgeScanner;