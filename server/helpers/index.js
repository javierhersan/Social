const Web3 = require("web3");

exports.sign = async (message) => {
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

exports.buildHeader = async (content, postID, updateID) => {
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

exports.post = async (content, postID, updateID) => {
    const header = await buildHeader(content, postID, updateID);
    console.log("Content:", content, " | ", "Header:", header);
    // Send content and header to server providers
}

exports.verify = async (header, content) => {
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