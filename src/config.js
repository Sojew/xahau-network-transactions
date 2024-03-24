// src/config.js

module.exports = {
    xahauServer: 'wss://xahau.network', // xahau-test.net   wss://xahau.network
    trustIssuers: [
        "rEvernodee8dJLaFsujS6q1EiXvZYmHXr8" // EVR
    ],
    minAmount: 2,
    groups: [
        {
            name: "Group 1",
            addresses: [
                {
                    address: "r33nPg5SmbmWPQNZ36U8bgEt49yvSyQPFj",
                    secret: "shX41FEPEEyLi6ZYW5AvtGHdzHmzD"
                },
                {
                    address: "r9HqQoiR7nnLaqZ2XsTkkUaN8BocnM9Z6m",
                    secret: "snfEtmiigWLEa2qRGqUUKByuqSW5o"
                },
                {
                    address: "rLYmXxvGn7AEaumehKxJwj896TPXcJfo79",
                    secret: "ssFhpv7DN18Czpp7U9W6wfuVUKkUD"
                }
            ],
            destinations: [
                {
                    address: "rMSm4GsFA1CYTEWCm6WcyVukgwUeBVzWRc",
                    percent: 20
                },
                {
                    address: "rH7ZAv17qPJW6pA3pz6CNdDec7uT9BCjj2",
                    percent: 30
                },
                {
                    address: "rMQmxgQGtE7JqJ26yynXT7Bdir2qNntot8",
                    percent: 50
                }
            ]
        },
        {
            addresses: [
                {
                    address: "raHpK6LvGStiffLLdwNX881SX4Rc4zv4q6",
                    secret: "saUgCZGsu2LKNUyNsqfxEycyZa9YH"
                },
                {
                    address: "rHyZiwB49f4eG7eFsnrZc2qXQe45WNbRv3",
                    secret: "sskNUmcfwGt3wcVgKY6qWEeX9MUZ6"
                },
                {
                    address: "r9nS5k2xzCe6HdrAEjwmnWpLBAXJoAyUEP",
                    secret: "snrGawyyURdUjTyTQFJHU4cr8RMiV",
                }
            ],
            destinations: [
                {
                    address: "rMSm4GsFA1CYTEWCm6WcyVukgwUeBVzWRc",
                    percent: 50
                },
                {
                    address: "rBSUELbmxXt1UbuDWXSbYjjQKTncQoFoJR",
                    percent: 50
                }
            ]
        },
        {
            addresses: [
                {
                    address: 'rUKBYria3Mi2mEnQAnhjeCmGbDT1cRjGNs',
                    secret: "shgpcoQUdnVn657bkDc7Z9ucDDjBW"
                }
            ],
            destinations: [
                {
                    address: "rBENb1SwemfJ19EMwBFWE91Sv1wKQa9ddc",
                    percent: 10
                },
                {
                    address: "r9ps1EqGBuZjd7FuKrvt1A9KixbCsrnLtD",
                    percent: 80
                },
                {
                    address: "rMPob9cJNF7janp7vD85eHVXvUJUMZmh11",
                    percent: 10
                }
            ]
        }
    ]
};
