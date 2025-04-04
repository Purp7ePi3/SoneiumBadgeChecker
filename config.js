/**
 * Configuration settings for the NFT verification tool
 */

// Lista dei contratti predefiniti
const DEFAULT_CONTRACTS = [
    { address: "0x9d83A657581A966aDf1c346dAfEE3EBe258EC26D", name: "Mithraeum: Badge" },
    { address: "0x7e058E9eeb81758F80049d0F2c1C1A7b47919697", name: "OmniHub" },
    { address: "0x890a19A1Dd75AAEcc4eDFce4685bb59C8ABEe78A", name: "Posse"},
    { address: "0x2A21B17E366836e5FFB19bd47edB03b4b551C89d", name: "OG badge"},
    { address: "0x1eC6AACC79f3c4817d7fea2268e1c54C6b2662Fb", name: "Owlto badge"},
    { address: "0x4591D540B692CBeD60Db7781B7683910f7a3BF8C", name: "NFT2Me"},
    { address: "0x066ABA7c3520e300113C0515FF41c084eE0c95Ea", name: "Sonus"},
    { address: "0x38bD4363b7Cd4040fAC6EEa5eF5d38E934AebD65", name: "CoPump"},
{ address: "0xCA707D22E248740aDaA9C63580F7A35201B18d30", name: "UneWeb"},
{ address: "0x11B2876C58cFb7501Db60d0112AF8A8EfEB0A81D", name: "KyoFinance"},
{ address: "0x3a634e6f8C2bf2C5894722B908d99e3cF9C62eD3", name: "Sake"},

];  

// API Endpoint
const API_BASE_URL = "https://soneium.blockscout.com/api/v2";

// Tipi di NFT supportati
const NFT_TYPES = "ERC-721%2CERC-404%2CERC-1155";

// Indirizzo del wallet predefinito
const DEFAULT_WALLET = "";

// Placeholder per le immagini
const IMAGE_PLACEHOLDER = "/api/placeholder/200/200";