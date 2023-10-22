import bip39 from "bip39";
import * as bip32 from "bip32";
import * as bitcoin from "bitcoinjs-lib";
import * as ecc from 'tiny-secp256k1';

async function createChildMnemonic(masterMnemonic, bip85Index) {
    // Convert the mnemonic phrase to a seed. This seed will be used for hierarchical deterministic (HD) key generation.
    const seed = await bip39.mnemonicToSeed(masterMnemonic);

    // Initialize a BIP32 root node for the bitcoin network. This is the starting point for all subsequent hierarchical key derivations.
    const rootNode = bip32.BIP32Factory(ecc).fromSeed(seed, bitcoin.networks.bitcoin);

    // Count the number of words in the master mnemonic to determine if we are working with a 12-word or 24-word seed.
    const wordCount = masterMnemonic.split(' ').length;

    // BIP85 specifies a particular derivation path format for HD wallets. The path format is m/83696968'/39'/0'/<word_count>'/<index>'.
    // - "83696968'" is the purpose field, set to the number representing "xpub" in T9 encoding, which indicates a BIP85 derivation.
    // - "39'" indicates the use of BIP39 mnemonic.
    // - "0'" is the account field, fixed at 0.
    // - "<word_count>'" uses the number of words in the mnemonic (typically 12 or 24).
    // - "<index>'" is the index of the derived key, set by the user.
    const path = `m/83696968'/39'/0/${wordCount}/${bip85Index}`;

    // Using the derived path, obtain the child node from which the new mnemonic will be generated.
    const childNode = rootNode.derivePath(path);

    // The entropy for a 12-word mnemonic is 128 bits and for a 24-word mnemonic, it's 256 bits.
    // This is derived from the fact that each word in a mnemonic represents 11 bits of entropy (12 words * 11 bits = 132, but the last 4 bits are checksum).
    const entropyBits = (wordCount === 12) ? 128 : 256;

    // Extract the required amount of entropy from the child node's private key.
    // For a 12-word mnemonic, we need the first 128 bits (or 16 bytes) of the private key.
    // For a 24-word mnemonic, we use the entire private key as entropy.
    let childEntropy = childNode.privateKey;
    if (entropyBits === 128) {
        childEntropy = childNode.privateKey.slice(0, 16); // Only use the first 16 bytes for 128 bits of entropy
    }

    // Convert the entropy into a mnemonic phrase. This will be a 12 or 24-word phrase depending on the amount of entropy.
    const childMnemonic = bip39.entropyToMnemonic(childEntropy);

    // Output the derived child mnemonic.
    console.log(`Derived child mnemonic: ${childMnemonic}`);
}

async function main() {
    // Retrieve the master mnemonic and the child index from the command line arguments.
    const mnemonic = process.argv[2];
    const index = process.argv[3];

    // Check for the necessary command line arguments and provide usage instructions if they're missing.
    if (!mnemonic || !index) {
        console.error('Error: Mnemonic and BIP85 index are required.');
        console.info('Usage: node <script> "<mnemonic>" <index>');
        process.exit(1);
    }

    // Create the child mnemonic using the provided master mnemonic and index.
    await createChildMnemonic(mnemonic, parseInt(index));
}

// Execute the main function and catch any errors.
main().catch(console.error);
