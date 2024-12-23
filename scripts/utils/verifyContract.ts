import { network, run } from 'hardhat';

export const verify = async (contractAddress: string, args: string[]) => {
  if (network.name.toLowerCase() === 'hardhat') return;

  console.log('Verifying contract...');
  try {
    await run('verify:verify', {
      address: contractAddress,
      constructorArguments: args
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes('already verified')) {
      console.log('Already verified!');
    } else {
      console.log(e);
    }
  }
};
