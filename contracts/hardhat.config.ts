import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      // rpc url, change it according to your ganache configuration
      url: 'http://127.0.0.1:8545',
      // the private key of signers, change it according to your ganache user
      accounts: [
        'd0c910b238ff7200dc2b63f1fe9765b73af124902b8762ece13c5da88375ea83',
        '74b6e1a05c9b322c63ae77ddfb531c75adcd8b4f0e4bb8e43fe24b4d7fcecf89',
        '907c8efc0527804b3da835d4ca5694c9fc58e0af68b6f1eee2f3a640b392c2ce',
        '12449bbba0111251b0d92245d04882cd93409181dad197d40ec39ed9fa0128f0',
      ]
    },
  },
};

export default config;
