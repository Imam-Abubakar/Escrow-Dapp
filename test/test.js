const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Escrow', function () {
	let contract;
	let sender;
	let receipient;
	let moderator;
	const deposit = ethers.utils.parseEther('1');
	beforeEach(async () => {
		sender = ethers.provider.getSigner(0);
		receipient = ethers.provider.getSigner(1);
		moderator = ethers.provider.getSigner(2);
		const Escrow = await ethers.getContractFactory('Escrow');
		contract = await Escrow.deploy(moderator.getAddress(), receipient.getAddress(), {
			value: deposit,
		});
		await contract.deployed();
	});

	it('should be funded initially', async function () {
		let balance = await ethers.provider.getBalance(contract.address);
		expect(balance).to.eq(deposit);
	});

	describe('after approval from address other than the moderator', () => {
		it('should revert', async () => {
			await expect(contract.connect(receipient).approve()).to.be.reverted;
		});
	});

	describe('after approval from the moderator', () => {
		it('should transfer balance to receipient', async () => {
			const before = await ethers.provider.getBalance(receipient.getAddress());
			const approveTxn = await contract.connect(moderator).approve();
			await approveTxn.wait();
			const after = await ethers.provider.getBalance(receipient.getAddress());
			expect(after.sub(before)).to.eq(deposit);
		});
	});
});
