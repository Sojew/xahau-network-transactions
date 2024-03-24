// src/transactionHandler.js

const xrpl = require('xrpl');
const { xahauServer, minAmount  } = require('./config');
const fs = require('fs');
const {findSecretByAddress, getTxLink, findGroupByAddress, validIssuer} = require("./utils");

const logStream = fs.createWriteStream('logfile.log', { flags: 'a' });

console.log = function(message) {
    logStream.write(message + '\n');
    process.stdout.write(message + '\n');
};

const client = new xrpl.Client(xahauServer);

module.exports = async (transaction) => {
    await client.connect();

    const groupData = findGroupByAddress(transaction.Destination);
    const secret = findSecretByAddress(transaction.Destination);

    const wallet = xrpl.Wallet.fromSeed(secret);

    if (typeof transaction.Amount === 'object') {
        /* Токен, проверяем issuers */
        if (validIssuer(transaction.Amount.issuer)) {
            for (const item of groupData.destinations) {
                const amountTx = (transaction.Amount.value * item.percent / 100).toString();
                const payment = {
                    TransactionType: "Payment",
                    Account: transaction.Destination,
                    Destination: item.address,
                    Amount: {
                        currency: transaction.Amount.currency,
                        issuer: transaction.Amount.issuer,
                        value: amountTx
                    },
                };

                let srcTrustLine = await checkTrustLine(client, wallet, transaction.Destination, transaction.Amount.currency, transaction.Amount.issuer)
                let dstTrustLine = await checkTrustLine(client, wallet, item.address, transaction.Amount.currency, transaction.Amount.issuer)
                if (!srcTrustLine) {
                    await establishTrustLine(client, wallet, transaction.Destination, secret, transaction.Amount.currency, transaction.Amount.issuer)
                }
                if (!dstTrustLine) {
                    console.log("Destination account " + item.address + " are not linked by trust lines.")
                    continue;
                }
                try {
                    const prepared = await client.autofill(payment);
                    const signed = wallet.sign(prepared);
                    const result = await client.submitAndWait(signed.tx_blob);
                    console.log(item.percent + "% " + getTxLink(result.result.hash));
                } catch (error) {
                    console.error('Tx send error:', error);
                }
            }
        }
    } else {
        let txAmount = xrpl.dropsToXrp(transaction.Amount);
        const accountInfo = await client.request({
            command: "account_info",
            account: transaction.Destination,
            ledger_index: "validated"
        });

        let balance = xrpl.dropsToXrp(accountInfo.result.account_data.Balance);

        if (balance < minAmount) {
            txAmount -= (minAmount - balance);
        }

        for (const item of groupData.destinations) {
            const payment = {
                TransactionType: "Payment",
                Account: transaction.Destination,
                Destination: item.address,
                Amount: parseInt(xrpl.xrpToDrops(txAmount) * item.percent / 100).toString(),
            };

            try {
                const prepared = await client.autofill(payment);
                const signed = wallet.sign(prepared);
                const result = await client.submitAndWait(signed.tx_blob);

                console.log(item.percent + "% " + getTxLink(result.result.hash));
            } catch (error) {
                console.error('Tx send error:', error);
            }
        }

    }
    // await client.disconnect();
};

async function checkTrustLine(client, wallet, accountAddress, currencyCode, issuerAddress) {

    const response = await client.request({
        command: "account_lines",
        account: accountAddress,
        ledger_index: "validated"
    });

    // Поиск линии доверия
    const trustLines = response.result.lines;
    const trustLine = trustLines.find(line =>
        line.account === issuerAddress &&
        line.currency === currencyCode
    );

    return trustLine || null; // Возвращает null, если линия доверия не найдена
}

async function establishTrustLine(client, wallet, receiverAddress, receiverSecret, currencyCode, issuerAddress) {

    const trustSetTx = {
        TransactionType: "TrustSet",
        Account: receiverAddress,
        LimitAmount: {
            currency: currencyCode,
            issuer: issuerAddress,
            value: 10000000000000
        }
    };

    const preparedTx = await client.autofill(trustSetTx);
    const signedTx = wallet.sign(preparedTx);
    return await client.submitAndWait(signedTx.tx_blob);
}