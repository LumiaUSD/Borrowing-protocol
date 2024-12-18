import { ethers, network } from 'hardhat';
import configLumia from '../../configs/collaterals/lumia';
import addressesLumia from '../../configs/addresses/lumia.json';

//* Update Debt ceiling (Max amount minted of MintableToken in total) in Vault Factory.
async function updateDebtCeiling(
  chainName: string,
  isTestnet: boolean,
  newDebtCeiling: string
) {
  console.log('Chain:', chainName);
  let config;
  let addresses;

  if (chainName == 'lumiaMainnet') {
    addresses = addressesLumia;
    config = configLumia;
  } else {
    throw new Error('invalid chain');
  }

  let depegWatchDog;
  if (!isTestnet) {
    [depegWatchDog] = await ethers.getSigners();
  } else {
    await network.provider.request({
      method: 'hardhat_impersonateAccount',
      params: [addresses.owner]
    });
    depegWatchDog = await ethers.getSigner(addresses.owner);
  }

  const ownerProxy = await ethers.getContractAt(
    'OwnerProxy',
    addresses.ownerProxy,
    depegWatchDog
  );

  console.log(`[!] Updating Debt ceiling in Vault Factory`);
  const types = ['uint256'];
  const encoder = ethers.AbiCoder.defaultAbiCoder();
  const encodedParams = encoder.encode(types, [newDebtCeiling]);

  const setDebtCeiling = await ownerProxy.executeOwner(
    addresses.vaultFactory,
    'setDebtCeiling(uint256)',
    encodedParams
  );
  if (!isTestnet) await setDebtCeiling.wait(1);

  console.log('-----------------------------------');
  return;
}

const isTestnet = false; //* Toggle to test before deployment
const chainName = 'lumiaMainnet';
const newDebtCeiling = '200000000000000000000000000';
// updateDebtCeiling(chainName, isTestnet, newDebtCeiling);
