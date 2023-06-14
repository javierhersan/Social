# Truffle

This project is ussing Truffle Suite for the smart contract development, testing and deployment.

First, we will execute the following commands for creating the Truffle project.

```
$ mkdir truffle
$ cd truffle
$ npm init -y
$ npm install truffle
$ npx truffle init
```

Then, open Ganache and edit *truffle-config.js* file.

```
module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "*"
        }
    },
    compilers: {
        solc: {
            version: "pragma"
        }
    }
};
```

Then, create the contracts, tests and migrations in their respective folders.
Afterwards we compile, deploy and test our smart contracts with the following commands.

```
$ npx truffle compile
$ npx truffle migrate
$ npx truffle test [<testfile>]
```

Finally, we can execute scripts.

```
$ npx truffle exec <scriptfile>
```

Use the following command for help.

```
$ npx truffle help <cmd>
```
Metamask > Settings > Networks > Add a network > Add a network manually
Network name: Ganache
New RPC URL: http://127.0.0.1:7545
Chain ID: 1337
Currency symbol: ETH
Block explorer URL (Optional)

React
copy truffle/build/contracts/DNS.json to client/src/contracts
npm start
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

npm install @drizzle/store
npm install @drizzle/react-plugin

https://trufflesuite.com/guides/getting-started-with-drizzle-and-react