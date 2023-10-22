# BIP85 Child Mnemonic Generator

This project is a Node.js application that uses BIP85 (Bitcoin Improvement Proposal 85) to derive a child mnemonic from
a master mnemonic. BIP85 allows the derivation of entropy from a master seed, which can
then be used for various purposes, such as creating child mnemonics in a standardized and recoverable way. This
application specifically creates a new mnemonic phrase (12 or 24 words) using the entropy derived from the master
mnemonic.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (https://nodejs.org/)
- You have a basic understanding of cryptocurrency wallet mnemonic phrases.

## Installing

To install the dependencies, follow these steps:

1. Clone the repository or download the source code from the repository.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the Node.js dependencies.

## Usage

To use the BIP85 Child Mnemonic Generator, follow these steps:

1. Open your terminal.
2. Change the directory to where your project is located.
3. Run the program using Node.js with the following syntax:

# node index.js "seed phrase here" 2

Will output a 24 word mnemonic phrase for BIP85 index 2.