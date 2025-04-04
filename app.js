// Toggle quick add wallet form
document.getElementById('addWalletBtn').addEventListener('click', function() {
    const quickAddForm = document.querySelector('.quick-add-wallet');
    quickAddForm.style.display = quickAddForm.style.display === 'flex' ? 'none' : 'flex';
});

// Set active wallet
function setActiveWallet(walletElement) {
    document.querySelectorAll('.wallet-item').forEach(item => {
        item.classList.remove('active');
    });
    walletElement.classList.add('active');
}

// Copy address to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Mostra un feedback visivo
    });
}

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    // Aggiungi gestori di eventi per i wallet
    document.querySelectorAll('.wallet-item').forEach(item => {
        item.addEventListener('click', function() {
            setActiveWallet(this);
            const address = this.querySelector('.wallet-address').textContent;
            document.getElementById('walletAddress').value = address;
        });
    });
    
    // Nascondi il form di aggiunta inizialmente
    document.querySelector('.quick-add-wallet').style.display = 'none';
});