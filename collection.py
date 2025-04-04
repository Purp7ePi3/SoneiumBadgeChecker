import requests
from collections import defaultdict

# Inserisci qui gli indirizzi da controllare
addresses = [
    "0x2C4554946fb9082f27585e9e147e19E86166C343",
    "0x6D481ad0E47510897bDC5826778a4B6A9895E35d",
    "0x10b1644e5f4267a8A8c8B6EB53ea074BB8a9517c"
    # "0xAltriIndirizziQui",
]

# Risultati aggregati: { contract_address: {name, total_amount} }
collection_summary = defaultdict(lambda: {'name': '', 'amount': 0})

for address in addresses:
    url = f"https://soneium.blockscout.com/api/v2/addresses/{address}/nft/collections"
    params = {
        "type": "ERC-721,ERC-404,ERC-1155"
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        for item in data.get("items", []):
            token = item["token"]
            contract_address = token["address"]
            token_name = token.get("name", "Sconosciuto")
            symbol = token.get("symbol", "Null")
            amount = int(item.get("amount", 0))

            collection_summary[contract_address]["name"] = token_name
            collection_summary[contract_address]["amount"] += amount
            collection_summary[contract_address]["symbol"] = symbol
    except requests.RequestException as e:
        print(f"Errore durante la richiesta per {address}: {e}")

# Ordina in base al nome del token
sorted_collections = sorted(
    collection_summary.items(),
    key=lambda x: (x[1]["name"] or "Sconosciuto").lower()
)

# Stampa
print("Collezioni NFT possedute (aggregate per più indirizzi):\n")
for contract_address, info in sorted_collections:
    print(f'address: "{contract_address}", name: "{info["name"]}" | {info["symbol"]} x {info["amount"]} ')
