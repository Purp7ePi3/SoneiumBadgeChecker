// Configuration constants
export const API_BASE_URL = "https://soneium.blockscout.com/api/v2";
export const NFT_TYPES = "ERC-721%2CERC-404%2CERC-1155";
export const IMAGE_PLACEHOLDER = "/api/placeholder/200/200";

// Default contracts to check
export const DEFAULT_CONTRACTS = [
    { address: "0x4a3b67b339c272fAb639B0CAF3Ce7852B2Aa0833", name: "WaveX"},
    { address: "0x8918531fC73f2c9047f0163eA126EeD1B8EA2c63", name: "2P2E"},
    { address: "0x9d83A657581A966aDf1c346dAfEE3EBe258EC26D", name: "Mithraeum: Badge" },
    { address: "0x7e058E9eeb81758F80049d0F2c1C1A7b47919697", name: "OmniHub" },
    { address: "0x890a19A1Dd75AAEcc4eDFce4685bb59C8ABEe78A", name: "Posse"},
    { address: "0x2A21B17E366836e5FFB19bd47edB03b4b551C89d", name: "OG badge"},
    { address: "0x1eC6AACC79f3c4817d7fea2268e1c54C6b2662Fb", name: "Owlto badge"},
    { address: "0x4591D540B692CBeD60Db7781B7683910f7a3BF8C", name: "NFT2Me"},
    { address: "0x066ABA7c3520e300113C0515FF41c084eE0c95Ea", name: "Sonus"},
    { address: "0x39C5DfF4e39779492C3AE3898c8d5a0579fE684e", name: "CoPump"},
    { address: "0xCA707D22E248740aDaA9C63580F7A35201B18d30", name: "UneWeb"},
    { address: "0x11B2876C58cFb7501Db60d0112AF8A8EfEB0A81D", name: "KyoFinance"},
    { address: "0x3a634e6f8C2bf2C5894722B908d99e3cF9C62eD3", name: "Sake"},
    { address: "0x44EEfAC1D5Db283B2dD99e226B864da271D82952", name: "Biru"},
    { address: "0xAa6c38A85e5781bCc410693B52F64EfF1aFcd3c6", name: "Sonex Goat"}, // Updated name
    { address: "0x2DCD9B33F0721000Dc1F8f84B804d4CFA23d7713", name: "Velodrome"},
    { address: "0x690B97980877b5d7915E89E6D0Cb9748A8bdAB8d", name: "Xstar"},
    { address: "0x7A475a650a4867577cf488E94ec023E593997fd6", name: "coNFT"},
    { address: "0x55E906C6Fb98894f05E1a7A533d77732B79a5414", name: "SuperVol"},
    { address: "0x391Dece93d18Fca922bF337C25Ee38BeA74Db63E", name: "Arkada"},
    { address: "0x9a4cC369A91AE5e8cBd99163a2eAC5b7957879dB", name: "Arcas"},
{ address: "0xcf87B2d5Ab008D41159f6737E2a5b6a3Bc40b753", name: "UntitledBank"},

];

// Badge info with total counts
export const BADGE_INFO = {
    'Owlto badge': { total: 6, description: "Owlto community badges" },    // TO MINT
    'Mithraeum: Badge': { total: 1, description: "Mithraeum participation badge" }, 
    'OmniHub': { total: 1, description: "OmniHub contributor badge" },
    'Posse': { total: 1, description: "Posse membership badge" },
    'OG badge': { total: 2, description: "Soneium platform badges" }, // Correctly indicates 2 badges
    'NFT2Me': { total: 1, description: "NFT2Me platform badge" },
    'Sonus': { total: 1, description: "Sonus community badge" },    // TO MINT
    'CoPump': { total: 1, description: "CoPump project badge" },
    'UneWeb': { total: 1, description: "UneWeb contributor badge" }, // TO MINT
    'KyoFinance': { total: 1, description: "KyoFinance community badge" },
    'Sake': { total: 1, description: "Sake protocol badge" },
    'Biru': { total: 1, description: "Beer badge"}, // TO MINT
    'Sonex Goat': { total: 1, description: "Goat badge"},
    'Velodrome': { total: 1, description: "Velodrome"},
    'Xstar': { total: 1, description: "Xstar"},
    'coNFT': { total: 1, description: "coNFT"},
    'SuperVol': { total: 1, description: "SuperVol"},
    'Arkada': { total: 1, description: "Arkada"},
    '2P2E': { total: 1, description: "2P2E"},
    'WaveX': { total: 1, description: "WaveX"},
    'Arcas': { total: 1, description: "Arcas"},
'Untitled': { total: 1, description: "Untitled"},
};

// Wallet addresses for tips
export const TIP_WALLETS = [
    { address: "0x41e7f0775465e17e12a733ec07083667bce4848e933f28ef0a773934a9903f85", label: "SUI" },
    { address: "5x8FTzLeyYso7t94roxgEKTMcQ6RV7rQBS6NgdtkoXt9", label: "Solana" },
    { address: "0xB23Ceba783956603CE63f1Bf52636e36b8a516C3", label: "Ethereum" }
];