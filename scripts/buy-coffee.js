// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat');

// Returns Eth balance in human readable form
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Eth balances for a list of addresses
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  // Get example accounts
  const [owner, tipper1, tipper2, tipper3] = await hre.ethers.getSigners();

  // Get contract to deploy & deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log('BuyMeACoffee deployed to ', buyMeACoffee.address);

  // Check balances before coffee purchase
  const addresses = [owner.address, tipper1.address, buyMeACoffee.address];
  console.log('== start ==');
  await printBalances(addresses);

  // Buy owner a coffee
  const tip = { value: hre.ethers.utils.parseEther('1') };
  await buyMeACoffee.connect(tipper1).buyCoffee('Caro', 'U the best', tip);
  await buyMeACoffee.connect(tipper2).buyCoffee('Vitto', 'Amazing', tip);
  await buyMeACoffee.connect(tipper3).buyCoffee('Kay', 'PoK NFTs rock', tip);

  // Check balances after purchase
  console.log('== bought coffee ==');
  await printBalances(addresses);

  // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balance after withdraw
  console.log('== withdrawTips ==');
  await printBalances(addresses);

  // Read all the memos for owner
  console.log('== memos ==');
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
