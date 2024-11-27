# Paca Bingo

A blockchain-based bingo game running on the Binance Smart Chain (BSC).

## Features

- Web-based bingo game interface
- BSC wallet integration (MetaMask)
- Smart contract for game logic and ticket sales
- Automatic win verification
- Prize pool distribution

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
- Copy `.env.example` to `.env`
- Add your BSC wallet private key to `.env`

3. Compile smart contracts:
```bash
npm run compile
```

4. Run tests:
```bash
npm test
```

5. Deploy to BSC testnet:
```bash
npm run deploy:testnet
```

6. Start local development server:
```bash
npm start
```

## Development

- Smart contracts are in the `contracts/` directory
- Tests are in the `test/` directory
- Deployment scripts are in the `scripts/` directory

## Testing

The project includes automated tests for the smart contract. Run them with:

```bash
npm test
```

## Deployment

1. Make sure your `.env` file is configured with your wallet's private key
2. Deploy to BSC testnet:
```bash
npm run deploy:testnet
```
3. Copy the deployed contract address to your `.env` file

## Playing the Game

1. Connect your MetaMask wallet to BSC
2. Purchase a ticket (0.01 BNB)
3. Numbers will be called automatically
4. Click numbers on your card as they are called
5. Win by completing a row or column

## Security

- Never share or commit your private keys
- Always test on testnet first
- Use a dedicated wallet for development

## License

MIT
