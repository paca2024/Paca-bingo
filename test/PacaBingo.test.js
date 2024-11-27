const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PacaBingo", function () {
  let PacaBingo;
  let pacaBingo;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    PacaBingo = await ethers.getContractFactory("PacaBingo");
    pacaBingo = await PacaBingo.deploy();
    await pacaBingo.deployed();
  });

  describe("Game Setup", function () {
    it("Should start with game ID 1", async function () {
      expect(await pacaBingo.currentGameId()).to.equal(1);
    });

    it("Should have correct ticket price", async function () {
      const ticketPrice = await pacaBingo.TICKET_PRICE();
      expect(ticketPrice).to.equal(ethers.utils.parseEther("0.01"));
    });
  });

  describe("Ticket Purchase", function () {
    it("Should allow ticket purchase with correct price", async function () {
      const numbers = Array(5).fill().map(() => 
        Array(5).fill().map((_, i) => i + 1)
      );
      
      await expect(pacaBingo.connect(addr1).buyTicket(numbers, {
        value: ethers.utils.parseEther("0.01")
      })).to.emit(pacaBingo, "TicketPurchased")
        .withArgs(1, addr1.address);
    });

    it("Should reject ticket purchase with incorrect price", async function () {
      const numbers = Array(5).fill().map(() => 
        Array(5).fill().map((_, i) => i + 1)
      );
      
      await expect(
        pacaBingo.connect(addr1).buyTicket(numbers, {
          value: ethers.utils.parseEther("0.02")
        })
      ).to.be.revertedWith("Incorrect ticket price");
    });
  });

  describe("Game Management", function () {
    it("Should allow owner to call numbers", async function () {
      await expect(pacaBingo.connect(owner).callNumber(1))
        .to.emit(pacaBingo, "NumberCalled")
        .withArgs(1, 1);
    });

    it("Should not allow non-owner to call numbers", async function () {
      await expect(
        pacaBingo.connect(addr1).callNumber(1)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
