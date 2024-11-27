class PacaBingo {
    constructor() {
        // Contract addresses on BSC
        this.contractAddress = '0x36294477e1b5eF4b6531DE2dD8aa79bb6ceBBd36';
        this.usdtAddress = '0x55d398326f99059fF775485246999027B3197955';
        
        // Initialize variables
        this.web3 = null;
        this.account = null;
        
        // Contract ABIs
        this.usdtABI = [
            {
                "constant": true,
                "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
                "name": "allowance",
                "outputs": [{"name": "", "type": "uint256"}],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
                "name": "approve",
                "outputs": [{"name": "", "type": "bool"}],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        
        this.contractABI = [
            {
                "inputs": [{"internalType": "uint8", "name": "mode", "type": "uint8"}],
                "name": "buyTicket",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
        ];
        
        // Setup MetaMask event listeners
        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
            window.ethereum.on('chainChanged', () => window.location.reload());
        }
    }

    async connectWallet() {
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

    async handleGameMode(mode) {
        try {
            if (!this.web3 || !this.account) {
                alert('Please connect your wallet first');
                return;
            }

            console.log(`Starting ${mode} mode...`);
            
            // Get entry fee based on mode
            const entryFees = {
                'solo': '1000000000000000000', // 1 USDT (18 decimals)
                '5v5': '2000000000000000000',  // 2 USDT
                '10v10': '5000000000000000000', // 5 USDT
                '20v20': '10000000000000000000' // 10 USDT
            };

            const entryFee = entryFees[mode];
            
            // First, check USDT allowance
            const usdtContract = new this.web3.eth.Contract(this.usdtABI, this.usdtAddress);
            const allowance = await usdtContract.methods.allowance(this.account, this.contractAddress).call();
            
            if (BigInt(allowance) < BigInt(entryFee)) {
                console.log('Requesting USDT approval...');
                // Request approval for max uint256
                const maxUint256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
                await usdtContract.methods.approve(this.contractAddress, maxUint256)
                    .send({ from: this.account });
            }

            // Get contract instance
            const gameContract = new this.web3.eth.Contract(this.contractABI, this.contractAddress);
            
            // Get mode enum value
            const modeEnum = this.getModeEnum(mode);
            
            // Buy ticket
            console.log(`Buying ticket for ${mode} mode...`);
            const tx = await gameContract.methods.buyTicket(modeEnum)
                .send({ from: this.account });
                
            console.log('Transaction successful:', tx.transactionHash);
            
            // Show success message
            const statusDiv = document.getElementById('status');
            statusDiv.className = 'status success';
            statusDiv.textContent = `Successfully joined ${mode} mode! Transaction: ${tx.transactionHash.substring(0, 10)}...`;

        } catch (error) {
            console.error('Error in game mode:', error);
            const statusDiv = document.getElementById('status');
            statusDiv.className = 'status error';
            statusDiv.textContent = `Error: ${error.message}`;
        }
    }

    getModeEnum(mode) {
        const modeEnum = {
            'solo': 0,
            '5v5': 1,
            '10v10': 2,
            '20v20': 3
        }[mode];
        return modeEnum;
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

    handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            this.disconnectWallet();
        } else if (accounts[0] !== this.account) {
            this.account = accounts[0];
            this.connectWallet();
        }
    }
}

// Initialize when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Creating PacaBingo instance...');
    window.pacaBingo = new PacaBingo();
    
    // Set up initial wallet connection button
    document.getElementById('connectWallet').onclick = () => window.pacaBingo.connectWallet();
    
    // Set up game mode buttons
    document.getElementById('soloMode').onclick = () => window.pacaBingo.handleGameMode('solo');
    document.getElementById('5v5Mode').onclick = () => window.pacaBingo.handleGameMode('5v5');
    document.getElementById('10v10Mode').onclick = () => window.pacaBingo.handleGameMode('10v10');
    document.getElementById('20v20Mode').onclick = () => window.pacaBingo.handleGameMode('20v20');
    
    // Disable game buttons initially
    window.pacaBingo.disableGameButtons();
});
