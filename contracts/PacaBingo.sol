// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./IERC20.sol";
import "./IStaking.sol";

contract PacaBingo is Ownable, ReentrancyGuard {
    IERC20 public usdt;
    IStaking public stakingContract;

    enum GameMode { SOLO, GROUP_5, GROUP_10, GROUP_20 }

    struct Game {
        GameMode mode;
        uint256 prizePool;
        bool active;
        address[] players;
    }

    mapping(GameMode => uint256) public ticketPrices;
    mapping(GameMode => uint256) public playerLimits;
    mapping(uint256 => Game) public games;
    mapping(address => uint256) public playerGames;
    uint256 public currentGameId;

    event GameCreated(uint256 indexed gameId, GameMode mode);
    event TicketPurchased(uint256 indexed gameId, address indexed player);
    event GameFinished(uint256 indexed gameId, address winner);

    constructor(address _usdtToken, address _stakingContract) {
        usdt = IERC20(_usdtToken);
        stakingContract = IStaking(_stakingContract);

        // Set ticket prices (in USDT)
        ticketPrices[GameMode.SOLO] = 1 * 10**18;      // 1 USDT
        ticketPrices[GameMode.GROUP_5] = 2 * 10**18;   // 2 USDT
        ticketPrices[GameMode.GROUP_10] = 5 * 10**18;  // 5 USDT
        ticketPrices[GameMode.GROUP_20] = 10 * 10**18; // 10 USDT

        // Set player limits
        playerLimits[GameMode.SOLO] = 1;
        playerLimits[GameMode.GROUP_5] = 5;
        playerLimits[GameMode.GROUP_10] = 10;
        playerLimits[GameMode.GROUP_20] = 20;
    }

    function buyTicket(GameMode mode) external nonReentrant {
        require(playerGames[msg.sender] == 0, "Already in a game");
        require(ticketPrices[mode] > 0, "Invalid game mode");

        // Transfer USDT
        require(usdt.transferFrom(msg.sender, address(this), ticketPrices[mode]), "USDT transfer failed");

        // Find or create game
        uint256 gameId = findOrCreateGame(mode);
        Game storage game = games[gameId];
        
        // Add player
        playerGames[msg.sender] = gameId;
        game.players.push(msg.sender);
        game.prizePool += ticketPrices[mode];

        emit TicketPurchased(gameId, msg.sender);

        // Start if full
        if (game.players.length == playerLimits[mode]) {
            _finishGame(gameId);
        }
    }

    function findOrCreateGame(GameMode mode) internal returns (uint256) {
        // Look for existing game
        for (uint256 i = currentGameId; i > 0; i--) {
            Game storage game = games[i];
            if (game.active && game.mode == mode && 
                game.players.length < playerLimits[mode]) {
                return i;
            }
        }

        // Create new game
        currentGameId++;
        games[currentGameId] = Game({
            mode: mode,
            prizePool: 0,
            active: true,
            players: new address[](0)
        });
        
        emit GameCreated(currentGameId, mode);
        return currentGameId;
    }

    function _finishGame(uint256 gameId) internal {
        Game storage game = games[gameId];
        require(game.active, "Game not active");

        // Select winner
        uint256 randomValue = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.prevrandao,
            msg.sender
        )));
        
        address winner = game.players[randomValue % game.players.length];
        uint256 prize = game.prizePool;
        
        // Reset game state
        game.prizePool = 0;
        game.active = false;

        // Clear player states
        for (uint i = 0; i < game.players.length; i++) {
            playerGames[game.players[i]] = 0;
        }

        // Stake prize
        require(usdt.approve(address(stakingContract), prize), "Staking approval failed");
        require(stakingContract.stake(prize), "Staking failed");

        emit GameFinished(gameId, winner);
    }

    // View functions
    function getGamePlayers(uint256 gameId) external view returns (address[] memory) {
        return games[gameId].players;
    }

    function getGameInfo(uint256 gameId) external view returns (
        GameMode mode,
        uint256 prizePool,
        bool active,
        uint256 playerCount
    ) {
        Game storage game = games[gameId];
        return (
            game.mode,
            game.prizePool,
            game.active,
            game.players.length
        );
    }
}
