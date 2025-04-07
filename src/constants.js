// Configuration constants
export const API_BASE_URL = "https://soneium.blockscout.com/api/v2";
export const NFT_TYPES = "ERC-721%2CERC-404%2CERC-1155";
export const IMAGE_PLACEHOLDER = "/api/placeholder/200/200";

// Default contracts to check
export const DEFAULT_CONTRACTS = [
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
    { address: "0x44EEfAC1D5Db283B2dD99e226B864da271D82952", name: "Biru"},
    { address: "0xAa6c38A85e5781bCc410693B52F64EfF1aFcd3c6", name: "Sonex Goat"}, // Updated name
];

// Badge info with total counts
export const BADGE_INFO = {
    'Owlto badge': { total: 6, description: "Owlto community badges" },
    'Mithraeum: Badge': { total: 1, description: "Mithraeum participation badge" },
    'OmniHub': { total: 1, description: "OmniHub contributor badge" },
    'Posse': { total: 1, description: "Posse membership badge" },
    'OG badge': { total: 2, description: "Soneium platform badges" }, // Correctly indicates 2 badges
    'NFT2Me': { total: 1, description: "NFT2Me platform badge" },
    'Sonus': { total: 1, description: "Sonus community badge" },
    'CoPump': { total: 1, description: "CoPump project badge" },
    'UneWeb': { total: 1, description: "UneWeb contributor badge" },
    'KyoFinance': { total: 1, description: "KyoFinance community badge" },
    'Sake': { total: 1, description: "Sake protocol badge" },
    'Biru': { total: 1, description: "Beer badge"},
    'Sonex Goat': { total: 1, description: "Goat badge"}
};

// Wallet addresses for tips
export const TIP_WALLETS = [
    { address: "0xc46bd9e23f603f2d7f3c46cdd0267caaffadf35e0cdde156c3328a4a3dd9d642", label: "SUI" },
    { address: "GRZFYyigEh4tXnLnpRodK2bnGbUp46AWJnEJNy3HNN1v", label: "Solana" },
    { address: "0x2C4554946fb9082f27585e9e147e19E86166C343", label: "Ethereum" }
];