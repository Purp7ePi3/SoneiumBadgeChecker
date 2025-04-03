/**
 * Configuration settings for the NFT verification tool
 */

// Lista dei contratti predefiniti
const DEFAULT_CONTRACTS = [
    { address: "0x9d83A657581A966aDf1c346dAfEE3EBe258EC26D", name: "Mithraeum: Badge" },
    { address: "0x7e058E9eeb81758F80049d0F2c1C1A7b47919697", name: "NFT #2" },
    { address: "0x890a19A1Dd75AAEcc4eDFce4685bb59C8ABEe78A", name: "Posse"},
    { address: "0x2A21B17E366836e5FFB19bd47edB03b4b551C89d", name: "OG badge 1"},
    { address: "0x1eC6AACC79f3c4817d7fea2268e1c54C6b2662Fb", name: "Soneium Bridger Badge"},

];

// API Endpoint
const API_BASE_URL = "https://soneium.blockscout.com/api/v2";

// Tipi di NFT supportati
const NFT_TYPES = "ERC-721%2CERC-404%2CERC-1155";

// Indirizzo del wallet predefinito
const DEFAULT_WALLET = "";

// Placeholder per le immagini
const IMAGE_PLACEHOLDER = "/api/placeholder/200/200";