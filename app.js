class PacaBingo {
    constructor() {
        console.log('PacaBingo constructor started');
        
        // App configuration
        this.appName = process.env.APP_NAME || 'Paca Bingo';
        this.apiKey = process.env.API_KEY;
        
        // Contract configuration
        this.contractAddress = '0x36294477e1b5eF4b6531DE2dD8aa79bb6ceBBd36';
        this.stakingAddress = '0x30D22DA999f201666fB94F09aedCA24419822e5C';
        this.adminAddress = '0x9B34b37dc4D5917A22289Cf51473c22a2F5f3984'.toLowerCase();
        this.usdtAddress = '0x55d398326f99059fF775485246999027B3197955';
        this.usdtABI = [
            {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}],
                "name": "balanceOf",
                "outputs": [{"name": "balance", "type": "uint256"}],
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {"name": "_spender", "type": "address"},
                    {"name": "_value", "type": "uint256"}
                ],
                "name": "approve",
                "outputs": [{"name": "", "type": "bool"}],
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {"name": "_owner", "type": "address"},
                    {"name": "_spender", "type": "address"}
                ],
                "name": "allowance",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            }
        ];
        this.contractABI = [
            {
                "inputs": [
                    {"internalType": "address", "name": "_usdtToken", "type": "address"},
                    {"internalType": "address", "name": "_stakingContract", "type": "address"}
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {"indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256"},
                    {"indexed": false, "internalType": "enum PacaBingo.GameMode", "name": "mode", "type": "uint8"}
                ],
                "name": "GameCreated",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {"indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256"},
                    {"indexed": false, "internalType": "address", "name": "winner", "type": "address"}
                ],
                "name": "GameFinished",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {"indexed": true, "internalType": "uint256", "name": "gameId", "type": "uint256"},
                    {"indexed": true, "internalType": "address", "name": "player", "type": "address"}
                ],
                "name": "TicketPurchased",
                "type": "event"
            },
            {
                "inputs": [{"internalType": "enum PacaBingo.GameMode", "name": "mode", "type": "uint8"}],
                "name": "buyTicket",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "currentGameId",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "gameId", "type": "uint256"}],
                "name": "getGameInfo",
                "outputs": [
                    {"internalType": "enum PacaBingo.GameMode", "name": "mode", "type": "uint8"},
                    {"internalType": "uint256", "name": "prizePool", "type": "uint256"},
                    {"internalType": "bool", "name": "active", "type": "bool"},
                    {"internalType": "uint256", "name": "playerCount", "type": "uint256"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "gameId", "type": "uint256"}],
                "name": "getGamePlayers",
                "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "name": "games",
                "outputs": [
                    {"internalType": "enum PacaBingo.GameMode", "name": "mode", "type": "uint8"},
                    {"internalType": "uint256", "name": "prizePool", "type": "uint256"},
                    {"internalType": "bool", "name": "active", "type": "bool"}
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "address", "name": "", "type": "address"}],
                "name": "playerGames",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "enum PacaBingo.GameMode", "name": "", "type": "uint8"}],
                "name": "playerLimits",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "stakingContract",
                "outputs": [{"internalType": "contract IStaking", "name": "", "type": "address"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [{"internalType": "enum PacaBingo.GameMode", "name": "", "type": "uint8"}],
                "name": "ticketPrices",
                "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "usdt",
                "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
                "stateMutability": "view",
                "type": "function"
            }
        ];
        
        // Initialize state
        this.web3 = null;
        this.contract = null;
        this.usdtContract = null;
        this.account = null;
        this.isAdmin = false;
        this.selectedMode = null;
        this.ws = null;

        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM loaded via event listener');
                this.init();
            });
        } else {
            console.log('DOM already loaded');
            this.init();
        }
    }

    async init() {
        console.log('Initializing PacaBingo...');
        
        // Get DOM elements
        this.connectBtn = document.getElementById('connectWalletBtn');
        this.walletInfo = document.getElementById('walletInfo');
        this.walletAddress = document.getElementById('walletAddress');
        this.disconnectBtn = document.getElementById('disconnectWalletBtn');
        this.adminPanel = document.getElementById('adminPanel');
        this.adminToggleBtn = document.getElementById('adminToggleBtn');

        // Add event listeners
        this.connectBtn.addEventListener('click', () => this.connectWallet());
        this.disconnectBtn.addEventListener('click', () => this.disconnectWallet());
        if (this.adminToggleBtn) {
            this.adminToggleBtn.addEventListener('click', () => this.toggleAdminPanel());
        }

        // Add click event listeners to mode cards
        document.querySelectorAll('.mode-card').forEach(card => {
            const selectBtn = card.querySelector('.select-mode-btn');
            if (selectBtn) {
                selectBtn.addEventListener('click', () => this.selectGameMode(card));
            }
        });

        // Connect WebSocket
        this.connectWebSocket();

        // Check if Web3 is injected by MetaMask
        if (typeof window.ethereum !== 'undefined') {
            try {
                this.web3 = new Web3(window.ethereum);
                
                // Initialize contracts
                this.contract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
                this.usdtContract = new this.web3.eth.Contract(this.usdtABI, this.usdtAddress);

                // Check if we're on BSC
                const chainId = await this.web3.eth.getChainId();
                if (chainId !== 56) { // BSC Mainnet
                    alert('Please switch to Binance Smart Chain Mainnet');
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x38' }], // BSC Mainnet
                    });
                }

                // Listen for account changes
                window.ethereum.on('accountsChanged', accounts => this.handleAccountsChanged(accounts));
                window.ethereum.on('chainChanged', () => window.location.reload());
                
                // Auto connect if previously connected
                this.connectWallet(true);
            } catch (error) {
                console.error('Failed to initialize Web3:', error);
                alert('Failed to initialize Web3: ' + error.message);
            }
        } else {
            console.log('Please install MetaMask!');
            alert('Please install MetaMask to play Paca Bingo!');
        }
    }

    connectWebSocket() {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${wsProtocol}//${window.location.hostname}:8080`;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
            console.log('Connected to WebSocket server');
            // Start sending ping messages to keep connection alive
            this.startPingInterval();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'playerCount') {
                    this.updateOnlineCount(data.count);
                }
            } catch (error) {
                console.error('Error processing WebSocket message:', error);
            }
        };

        this.ws.onclose = () => {
            console.log('WebSocket connection closed');
            // Try to reconnect after 5 seconds
            setTimeout(() => this.connectWebSocket(), 5000);
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    startPingInterval() {
        // Send ping every 30 seconds to keep connection alive
        setInterval(() => {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.ping();
            }
        }, 30000);
    }

    updateOnlineCount(count) {
        if (this.onlineCount) {
            this.onlineCount.textContent = count;
            
            // Update game mode availability based on player count
            document.querySelectorAll('.mode-card').forEach(card => {
                const mode = card.dataset.mode;
                const minPlayers = {
                    'Solo': 1,
                    '5v5': 5,
                    '10v10': 10,
                    '20v20': 20
                }[mode];

                const priceSpan = card.querySelector('.price');
                const button = card.querySelector('.select-mode-btn');

                if (count < minPlayers) {
                    card.classList.add('disabled');
                    priceSpan.textContent = `Not enough players (${count}/${minPlayers})`;
                    button.disabled = true;
                } else {
                    card.classList.remove('disabled');
                    if (this.account) {
                        // If wallet is connected, show the price
                        this.updateGameModePrices();
                    } else {
                        // If wallet is not connected, show connect wallet message
                        priceSpan.textContent = 'Connect Wallet';
                    }
                    button.disabled = !this.account;
                }
            });
        }
    }

    async connectWallet(silent = false) {
        try {
            console.log('Connecting wallet...');
            // Check if MetaMask is installed
            if (typeof window.ethereum !== 'undefined') {
                // Request account access
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                this.account = accounts[0];
                console.log('Connected wallet:', this.account);

                // Initialize Web3
                this.web3 = new Web3(window.ethereum);

                // Update UI
                document.getElementById('walletStatus').innerHTML = `
                    <p>Connected: ${this.account.substring(0, 6)}...${this.account.substring(38)}</p>
                    <button class="connect-wallet" onclick="window.pacaBingo.disconnectWallet()">Disconnect Wallet</button>
                `;

                // Enable game mode buttons
                this.enableGameButtons();
                return true;
            } else {
                console.error('MetaMask is not installed');
                alert('Please install MetaMask to use this dApp');
                return false;
            }
        } catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet: ' + error.message);
            return false;
        }
    }

    disconnectWallet() {
        this.account = null;
        this.web3 = null;
        
        // Update UI
        document.getElementById('walletStatus').innerHTML = `
            <p>Connect your wallet to start playing</p>
            <button class="connect-wallet" onclick="window.pacaBingo.connectWallet()">Connect Wallet</button>
        `;

        // Disable game mode buttons
        this.disableGameButtons();
    }

    enableGameButtons() {
        const buttons = document.querySelectorAll('.game-mode button');
        buttons.forEach(button => {
            button.disabled = false;
            button.style.opacity = '1';
        });
    }

    disableGameButtons() {
        const buttons = document.querySelectorAll('.game-mode button');
        buttons.forEach(button => {
            button.disabled = true;
            button.style.opacity = '0.5';
        });
    }

    async updateGameModePrices() {
        if (!this.account) return;

        const modes = {
            'Solo': 1,
            '5v5': 2,
            '10v10': 5,
            '20v20': 10
        };

        document.querySelectorAll('.mode-card').forEach(async card => {
            const mode = card.dataset.mode;
            const priceInUSDT = modes[mode];
            const priceSpan = card.querySelector('.price');
            if (priceSpan) {
                priceSpan.textContent = `${priceInUSDT} USDT`;
            }
        });
    }

    async selectGameMode(card) {
        if (!this.account) {
            alert('Please connect your wallet first');
            return;
        }

        const mode = card.dataset.mode;
        const modeEnum = this.getModeEnum(mode);
        
        try {
            console.log('Starting ticket purchase for mode:', mode, 'enum:', modeEnum);
            
            // Get game mode config
            const config = await this.contract.methods.gameModeConfigs(modeEnum).call();
            console.log('Game mode config:', config);
            const price = config.ticketPrice;

            // Check USDT balance
            const balance = await this.usdtContract.methods.balanceOf(this.account).call();
            console.log('USDT Balance:', balance);
            if (BigInt(balance) < BigInt(price)) {
                alert('Insufficient USDT balance');
                return;
            }

            // Check current allowance
            const allowance = await this.usdtContract.methods.allowance(this.account, this.contractAddress).call();
            console.log('Current allowance:', allowance);
            
            // First approve USDT spending if needed
            if (BigInt(allowance) < BigInt(price)) {
                console.log('Approving USDT spending...');
                const approveResult = await this.usdtContract.methods.approve(this.contractAddress, price)
                    .send({ from: this.account });
                console.log('USDT approved:', approveResult);
            } else {
                console.log('USDT already approved');
            }

            // Then buy the ticket
            console.log('Buying ticket...');
            const result = await this.contract.methods.buyTicket(modeEnum)
                .send({ 
                    from: this.account,
                    gasLimit: 500000 // Add explicit gas limit
                });
            console.log('Ticket purchased:', result);

            this.selectedMode = mode;
            
            // Update UI after purchase
            this.updateGameModePrices();
            alert('Ticket purchased successfully! Game will start when enough players join.');
        } catch (error) {
            console.error('Error purchasing ticket:', error);
            alert('Error purchasing ticket: ' + error.message);
        }
    }

    getModeEnum(mode) {
        const modeEnum = {
            'Solo': 0,
            '5v5': 1,
            '10v10': 2,
            '20v20': 3
        }[mode];
        return modeEnum;
    }

    async handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.disconnectWallet();
        } else if (accounts[0] !== this.account) {
            this.account = accounts[0];
            await this.connectWallet(true);
        }
    }

    toggleAdminPanel() {
        console.log('Toggling admin panel');
        if (this.adminControls) {
            const isVisible = this.adminControls.style.display === 'block';
            this.adminControls.style.display = isVisible ? 'none' : 'block';
            console.log('Admin panel visibility:', !isVisible);
        } else {
            console.error('Admin controls element not found');
        }
    }

    async updateGameModePrice() {
        try {
            const modeSelect = document.getElementById('adminModeSelect');
            const newPriceInput = document.getElementById('newPrice');
            
            if (!modeSelect || !newPriceInput) {
                throw new Error('Admin control elements not found');
            }

            const mode = modeSelect.value;
            const priceInBNB = newPriceInput.value;
            
            if (!priceInBNB || isNaN(priceInBNB) || priceInBNB <= 0) {
                throw new Error('Invalid price');
            }

            const priceInWei = this.web3.utils.toWei(priceInBNB, 'ether');
            
            // Convert mode string to enum value
            const modeEnum = {
                'Solo': 0,
                '5v5': 1,
                '10v10': 2,
                '20v20': 3
            }[mode];

            await this.contract.methods.updateGameModeConfig(
                modeEnum,
                1, // minPlayers (keeping existing)
                20, // maxPlayers (keeping existing)
                priceInWei,
                true // active
            ).send({ from: this.account });

            alert('Price updated successfully!');
            await this.updateGameModePrices();
        } catch (error) {
            console.error('Error updating price:', error);
            alert('Failed to update price: ' + error.message);
        }
    }

    async updatePrizeInfo(gameId) {
        try {
            const game = await this.contract.methods.games(gameId).call();
            const prizePool = game.prizePool;
            
            // Calculate prizes
            const oneLinePrize = (prizePool * 30) / 100; // 30% for one line
            const fullHousePrize = (prizePool * 70) / 100; // 70% for full house
            
            // Update UI with prize amounts
            document.getElementById('oneLinePrize').textContent = `${this.web3.utils.fromWei(oneLinePrize.toString(), 'ether')} USDT`;
            document.getElementById('fullHousePrize').textContent = `${this.web3.utils.fromWei(fullHousePrize.toString(), 'ether')} USDT`;
            
            // Show winner addresses if available
            if (game.hasOneLineWinner) {
                document.getElementById('oneLineWinner').textContent = `Winner: ${this.shortenAddress(game.oneLineWinner)}`;
            }
            
            if (game.hasFullHouseWinner) {
                document.getElementById('fullHouseWinner').textContent = `Winner: ${this.shortenAddress(game.fullHouseWinner)}`;
            }
        } catch (error) {
            console.error('Error updating prize info:', error);
        }
    }

    shortenAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }

    async monitorGameState() {
        if (!this.account) return;

        try {
            // Get player's current game
            const gameId = await this.contract.methods.playerGames(this.account).call();
            if (gameId === '0') return; // No active game

            // Get game state
            const gameState = await this.contract.methods.gameStates(gameId).call();
            const currentGame = await this.contract.methods.currentGames(gameId).call();

            console.log('Game State:', {gameId, gameState, currentGame});

            if (gameState.finished && gameState.winner === this.account) {
                // Player won!
                alert('Congratulations! You won! Your prize has been automatically staked. Check your stake at https://paca.finance');
                
                // Try to claim prize
                try {
                    await this.contract.methods.claimPrize(gameId).send({ from: this.account });
                } catch (error) {
                    console.error('Error claiming prize:', error);
                }
            }
        } catch (error) {
            console.error('Error monitoring game state:', error);
        }

        // Check again in 5 seconds
        setTimeout(() => this.monitorGameState(), 5000);
    }
}

// Initialize when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Creating PacaBingo instance...');
    window.pacaBingo = new PacaBingo();
    
    // Set up initial wallet connection button
    document.getElementById('connectWallet').onclick = () => window.pacaBingo.connectWallet();
    
    // Disable game buttons initially
    window.pacaBingo.disableGameButtons();
});
