// src/index.js

const xrpl = require('xrpl');
const { xahauServer } = require('./config');
const { findGroupByAddress, getAllAddresses } = require('./utils');
const handleTransaction = require('./transactionHandler');

const client = new xrpl.Client(xahauServer);
const main = async () => {
    await client.connect();

    // Отслеживание транзакций для определённого адреса
    client.on('transaction', (event) => {
        if (findGroupByAddress(event.transaction.Destination)) {
            handleTransaction(event.transaction);
        }
    });

    let list = getAllAddresses();
    list.forEach(address => {
        if (xrpl.isValidClassicAddress(address)) {
            client.request({
                command: "subscribe",
                accounts: [address]
            }).then(() => {
                console.log(`Subscribed to ${address}`);
            }).catch(error => {
                console.error(`Error subscribing to ${address}:`, error);
            });
        } else {
            console.error(`Invalid XRPL address: ${address}`);
        }
    });

    console.log('Success subscriptions');
};

main().catch(console.error);
