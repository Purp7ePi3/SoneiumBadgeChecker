import React, { useState } from 'react';
import { isValidAddress, isContractDuplicate, isDefaultContract } from '../utils/helpers';

const ContractsList = ({ contracts, setContracts }) => {
    const [contractInput, setContractInput] = useState('');
    const [error, setError] = useState('');

    const addContract = () => {
        const contractAddress = contractInput.trim();
        
        if (!contractAddress) {
            setError('Please enter a valid contract address');
            return;
        }
        
        if (!isValidAddress(contractAddress)) {
            setError('Invalid contract address format');
            return;
        }
        
        if (isContractDuplicate(contractAddress, contracts)) {
            setError('This contract is already in the list');
            return;
        }
        
        setContracts([...contracts, { 
            address: contractAddress, 
            name: `NFT #${contracts.length + 1}` 
        }]);
        setContractInput('');
        setError('');
    };

    const removeContract = (index) => {
        const updatedContracts = [...contracts];
        updatedContracts.splice(index, 1);
        setContracts(updatedContracts);
    };

    return (
        <div className="card shadow-sm mb-4">
            <div className="card-body">
                <h2 className="h5 mb-3">Contract Management</h2>
                
                <div className="mb-3">
                    <label htmlFor="contractAddress" className="form-label">Add Contract</label>
                    <div className="input-group">
                        <input 
                            type="text" 
                            className="form-control" 
                            id="contractAddress"
                            placeholder="Contract address (0x...)" 
                            value={contractInput}
                            onChange={(e) => setContractInput(e.target.value)}
                        />
                        <button 
                            className="btn btn-primary" 
                            onClick={addContract}
                        >
                            Add
                        </button>
                    </div>
                    {error && <div className="text-danger mt-2 small">{error}</div>}
                </div>
                
                <div id="contractsList" className="list-group mt-3">
                    {contracts.length === 0 ? (
                        <p className="p-3 text-muted">No contracts added yet</p>
                    ) : (
                        contracts.map((contract, index) => (
                            <div 
                                key={index} 
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <span className="fw-medium">{contract.name}</span>
                                {!isDefaultContract(contract.address) && (
                                    <button 
                                        className="btn btn-sm btn-outline-danger" 
                                        onClick={() => removeContract(index)}
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContractsList;