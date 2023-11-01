const path = require('path');
const fs = require('fs');
const solc = require('solc');

const cPath = path.resolve(__dirname, './contracts/Contract.sol');
const cSource = fs.readFileSync(cPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'Contract.sol': {
      content: cSource,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
};

console.log(solc.compile(JSON.stringify(input)));
