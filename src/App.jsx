import React, { useState } from 'react';
import Header from './components/Header';
import BadgeScanner from './components/BadgeScanner';
import ContractsList from './components/ContractsList';
import TipCard from './components/TipCard';
import AboutCard from './components/AboutCard';
import Toast from './components/Toast';
import { DEFAULT_CONTRACTS } from './constants';
import './styles.css';

function App() {
    const [contracts, setContracts] = useState([...DEFAULT_CONTRACTS]);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);

    const handleShowToast = (message) => {
        setToastMessage(message);
        setShowToast(true);
    };

    return (
        <>
            <Header />
            
            <div className="container py-4">
                <div className="row g-4">
                    {/* Main Content Column */}
                    <div className="col-lg-8">
                        <BadgeScanner contracts={contracts} />
                    </div>

                    {/* Sidebar Column */}
                    <div className="col-lg-4">
                        <div className="position-sticky" style={{ top: '5rem' }}>
                            <ContractsList 
                                contracts={contracts} 
                                setContracts={setContracts} 
                            />
                            <TipCard showToast={handleShowToast} />
                            <AboutCard />
                        </div>
                    </div>
                </div>
            </div>

            <Toast 
                message={toastMessage} 
                show={showToast} 
                setShow={setShowToast} 
            />

            <footer className="mt-4 py-3 bg-light">
                <div className="container text-center">
                    <p className="mb-0 text-muted">&copy; 2025 BadgeChecker. Tutti i diritti riservati.</p>
                </div>
            </footer>
        </>
    );
}

export default App;