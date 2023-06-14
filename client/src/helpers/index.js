import Web3 from "web3";

export const sign = async (message) => {
    try{
        const web3 = new Web3("http://localhost:7545");
    
        // Hash the header params
        const hash = web3.utils.sha3(message);
        
        //const accounts = await web3.eth.getAccounts()
        // const account = accounts[0] // Public key))
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        const account = accounts[0];

        // Sign the hash
        const signature = await web3.eth.sign(hash, account);
        return signature;

    } catch(err) {
        console.log(err);
        return null;
    }
}

export const buildHeader = async (content, postID, updateID) => {
    const web3 = new Web3("http://localhost:7545");
    
    //const accounts = await web3.eth.getAccounts()
    // const account = accounts[0] // Public key))
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const account = accounts[0];

    // postID
    // updateID
    let outputHash = null
    if(typeof(content)==="object"){
        outputHash = web3.utils.sha3(JSON.stringify(content));
    } else {
        outputHash = web3.utils.sha3(content);
    }
    const address = account;
    const signature = await sign(postID+updateID+address+outputHash);
    
    const header = {
        'signature': signature,
        'post_id': postID,
        'update_id': updateID,
        'address': address,
        'output_hash': outputHash,
    };

    return header;
}

export const post = async (content, postID, updateID) => {
    const header = await buildHeader(content, postID, updateID);
    console.log("Content:", content, " | ", "Header:", header);
    // Send content and header to server providers
}

export const verify = async (header, content) => {
    try{
        const web3 = new Web3("http://localhost:7545");
        
        // Header
        const postID = header.post_id;
        const updateID = header.update_id;
        const outputHash = header.output_hash;
        const address = header.address;
        const signature = header.signature;

        // Check if the content produces the output-hash of the header
        if(typeof(content)==="object"){
            if(outputHash !== web3.utils.sha3(JSON.stringify(content))){
                return false;
            }
        } else {
            if(outputHash !== web3.utils.sha3(content)){
                return false;
            }
        }

        // Verify the signature
        const hash = web3.utils.sha3(postID+updateID+address+outputHash);
        const signingAddress = web3.eth.accounts.recover(hash, signature);
        if(address.toLowerCase !== signingAddress.toLowerCase){
            return false;
        }

        return true;

      } catch(err){
        console.log(err);
      }
}

export const verifyMetadata = async (header, metadata) => {
    try{
        const web3 = new Web3("http://localhost:7545");
        
        // Header
        const updateID = header.update_id;
        const outputHash = header.output_hash;
        const address = header.address;
        const signature = header.signature

        // Check if the content produces the output-hash of the header
        if(outputHash !== web3.utils.sha3(JSON.stringify(metadata))){
            return false;
        }

        // Verify the signature
        const hash = web3.utils.sha3(updateID+address+outputHash);
        const signingAddress = web3.eth.accounts.recover(hash, signature);
        if(address.toLowerCase !== signingAddress.toLowerCase){
            return false;
        }

        return true;

      } catch(err){
        console.log(err);
      }
}

export const verifyHeader = async (header) => {
    try{
        const web3 = new Web3("http://localhost:7545");
        
        // Header
        const postID = header.post_id;
        const updateID = header.update_id;
        const outputHash = header.output_hash;
        const address = header.address;
        const signature = header.signature

        // Verify the signature
        const hash = web3.utils.sha3(postID+updateID+address+outputHash);
        const signingAddress = web3.eth.accounts.recover(hash, signature);
        if(address.toLowerCase !== signingAddress.toLowerCase){
            return false;
        }

        return true;

      } catch(err){
        console.log(err);
      }
}

// ----------------------------------------------------------------------------------------------------------------------- //
// ------------------------------------------ Encryption and decryption modules ------------------------------------------ //
// ----------------------------------------------------------------------------------------------------------------------- //
export const generateKeyPair = async () => {
    //const key = CryptoJS.enc.Utf8.parse(Math.random());
    //const key = CryptoJS.lib.WordArray.random(16);
    
    let keypair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]), // 65537
          hash: "SHA-256",
        },
        true, // Extractable
        ["encrypt", "decrypt"]
      );

    return keypair;
}

export const encrypt = async (publicKey, plaintext) => {
    // const encryptedtext = CryptoJS.AES.encrypt(plaintext, key, { mode: CryptoJS.mode.ECB }).toString();
    const encryptedtext = await window.crypto.subtle.encrypt(
        {
          name: "RSA-OAEP",
        },
        publicKey,
        new TextEncoder().encode(plaintext)
      );
    return encryptedtext;
};

export const decrypt = async (privateKey, encryptedtext) => {
    //const decryptedtext = CryptoJS.AES.decrypt(encryptedtext, key, { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
    const decrypted = await window.crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKey,
        encryptedtext
      );
    const decryptedtext = new TextDecoder().decode(decrypted);
    return decryptedtext;
}

//------------------------------------------------------------

// async function encryptDataSaveKey() {
// 	var data = await makeData();
// 	console.log("generated data", data);
// 	var keys = await makeKeys()
// 	var encrypted = await encrypt(data, keys);
// 	callOnStore(function (store) {
// 		store.put({id: 1, keys: keys, encrypted: encrypted});
// 	})
// }

// function loadKeyDecryptData() {
// 	callOnStore(function (store) {
//     var getData = store.get(1);
//     getData.onsuccess = async function() {
//     	var keys = getData.result.keys;
//       var encrypted = getData.result.encrypted;
// 			var data = await decrypt(encrypted, keys);
// 			console.log("decrypted data", data);
// 	   };
// 	})
// }

// function callOnStore(fn_) {

// 	// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
// 	var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

// 	// Open (or create) the database
// 	var open = indexedDB.open("MyDatabase", 1);

// 	// Create the schema
// 	open.onupgradeneeded = function() {
// 	    var db = open.result;
// 	    var store = db.createObjectStore("MyObjectStore", {keyPath: "id"});
// 	};


// 	open.onsuccess = function() {
// 	    // Start a new transaction
// 	    var db = open.result;
// 	    var tx = db.transaction("MyObjectStore", "readwrite");
// 	    var store = tx.objectStore("MyObjectStore");

// 	    fn_(store)


// 	    // Close the db when the transaction is done
// 	    tx.oncomplete = function() {
// 	        db.close();
// 	    };
// 	}
// }

// async function encryptDecrypt() {
// 	var data = await makeData();
// 	console.log("generated data", data);
// 	var keys = await makeKeys()
// 	var encrypted = await encrypt(data, keys);
// 	console.log("encrypted", encrypted);
// 	var finalData = await decrypt(encrypted, keys);
// 	console.log("decrypted data", data);
// }

// function makeData() {
// 	return window.crypto.getRandomValues(new Uint8Array(16))
// }

// function makeKeys() {
// 	return window.crypto.subtle.generateKey(
//     {
//         name: "RSA-OAEP",
//         modulusLength: 2048, //can be 1024, 2048, or 4096
//         publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
//         hash: {name: "SHA-256"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
//     },
//     false, //whether the key is extractable (i.e. can be used in exportKey)
//     ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
//    )
// }

// function encrypt(data, keys) {
// 	return window.crypto.subtle.encrypt(
//     {
//         name: "RSA-OAEP",
//         //label: Uint8Array([...]) //optional
//     },
//     keys.publicKey, //from generateKey or importKey above
//     data //ArrayBuffer of data you want to encrypt
// )
// }


// async function decrypt(data, keys) {
// 	return new Uint8Array(await window.crypto.subtle.decrypt(
// 	    {
// 	        name: "RSA-OAEP",
// 	        //label: Uint8Array([...]) //optional
// 	    },
// 	    keys.privateKey, //from generateKey or importKey above
// 	    data //ArrayBuffer of the data
// 	));
// }
  