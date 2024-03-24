const {groups, xahauServer, trustIssuers} = require('./config');

function findGroupByAddress(targetAddress) {
    for (let group of groups) {
        if (group.addresses.some(addr => addr.address.toLowerCase() === targetAddress.toLowerCase())) {
            return group;
        }
    }
    return null;
}
function getAllAddresses() {
    return groups.reduce((addresses, group) => {
        const groupAddresses = group.addresses.map(addr => addr.address);
        return addresses.concat(groupAddresses);
    }, []);
}
function findSecretByAddress(targetAddress) {
    for (let group of groups) {
        for (let addressObj of group.addresses) {
            if (addressObj.address.toLowerCase() === targetAddress.toLowerCase()) {
                return addressObj.secret;
            }
        }
    }
    return null;
}

function getTxLink(hash) {
    let  link = "https://explorer.xahau.network/tx/" + hash;
    if(xahauServer !== 'wss://xahau.network') {
        link = "https://explorer.xahau-test.net/tx/" + hash;
    }
    return link;
}
function validIssuer(issuer) {
    return trustIssuers.some(str => str.toLowerCase() === issuer.toLowerCase());
}

module.exports = {
    findGroupByAddress,
    getAllAddresses,
    findSecretByAddress,
    getTxLink,
    validIssuer
};