import { Drizzle } from '@drizzle/store';

import DNS from './contracts/DNS.json';

// Opciones:
const options = {
    contracts: [ DNS ],
    polls: {
        accounts: 3000,
    },
    web3: {
        fallback: {
            type: "ws",
            url: "ws://127.0.0.1:7545"
        }
    }
}

const drizzle = new Drizzle(options);
// Crear y exportar el objeto drizzle:
export default drizzle;



