import {get, set, getKeysStartingBy} from './LocalDBService'
import { generateKeyPair, encrypt, decrypt, buildHeader, verify } from '../helpers';

export const getChatList = (myAddress) => {
    let keys = getKeysStartingBy(myAddress+"-");
    let chats = [];
    for (let i = 0; i < keys.length; i++){
        chats.push(JSON.parse(get(keys[i])))
    }
    return chats;
}

export const createChat = (myAddress, userAddress) => {
    let chats = getChatList(myAddress);
    console.log(chats)

    // Check if exists
    for (let i = 0; i < chats.length; i++){
        //Already exists
        if(chats[i] === myAddress+"-"+userAddress){
            return;
        }
    }
    set(myAddress+"-"+userAddress, JSON.stringify({user: userAddress, messages:[], keypair:null, userPublicKey:null}));
}

export const generateKeys = async (myAddress, userAddress, userProviders) => {
    let chats = getChatList(myAddress);
    // Check if exists
    let exists = false;
    for (let i = 0; i < chats.length; i++){
        //Already exists
        if(chats[i].user === userAddress){
            exists = true;
        }
    }
    if(exists === false){
        return;
    }

    // If the chat exist save keypair
    let chat = JSON.parse(get(myAddress+"-"+userAddress))
    // Only if the keys are null generate them
    if(chat.keypair===null){
        let keypair = await generateKeyPair();
        let content = {address: myAddress, messageId: 0, publicKey: await window.crypto.subtle.exportKey('jwk',keypair.publicKey)}
        // save and send the message
        set(myAddress+"-"+userAddress, JSON.stringify({user: userAddress, messages:chat.messages, keypair:{publicKey: await window.crypto.subtle.exportKey('jwk',keypair.publicKey), privateKey: await window.crypto.subtle.exportKey('jwk',keypair.privateKey)}, userPublicKey:chat.userPublicKey}));
        await saveMyMessage(myAddress, userAddress, userProviders, content);
    }
 
    //console.log(get(myAddress+"-"+userAddress))
}

export const getMyPublicKey = async (myAddress, userAddress) => {
    let chat = JSON.parse(get(myAddress+"-"+userAddress))
    // Only if the keys are null generate them
    if(chat !== undefined && chat.keypair !== null){
        return chat.keypair.publicKey
    } else {
        return;
    }
}

export const dispatchMessages = async (myAddress, myProviders) =>{
    if(myProviders){
        let urlProvider1 = 'http://'+myProviders.provider1+"/"+myAddress+"/chats"
        //let urlProvider1 = "http://localhost:4200/0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1/chats"
        try{
            let response = await fetch(urlProvider1, {
                method:'get',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
            })
            let json = await response.json();
            let chats = getChatList(myAddress);
            // Repartir los mensajes por los distintos chats
            for (let i = 0; i < json.length; i++){
                //Already exists
                if(chats.length === 0){
                    createChat(myAddress, json[i].content.address)
                    console.log("Create")
                    // generate keys
                    // consume the user keys
                    // consume the message
                }
                for(let j = 0; j < chats.length; j++){
                    if((myAddress+"-"+json[i].content.address).toLowerCase() === getKeysStartingBy(myAddress+"-"+json[i].content.address)[0].toLowerCase()){
                        if(json[i].content.publicKey !== undefined && json[i].content.publicKey !== null){
                            saveUserPublicKey(myAddress, json[i].content.address, json[i].content.publicKey)
                        }
                        await saveMessage(myAddress, json[i].content.address, json[i].content)
                        continue;
                    } 
                    if(j === chats.length-1){
                        createChat(myAddress, json[i].content.address)
                        // generate keys
                        // consume the user keys
                        // consume the message
                    }   
                }
            }
        } catch(err){}
    }
}

export const saveMyMessage = async (myAddress, userAddress, userProviders, content) => {
    // // Save as a message
    let chat = JSON.parse(get(myAddress+"-"+userAddress));
    // find if the message is already in
    let isMessageSaved = false

    // eslint-disable-next-line
    chat.messages.some((message) => {
        if (message?.messageId === content.messageId && message?.address === content.address){
            isMessageSaved = true
        }
    });
    if(!isMessageSaved){
        // add it if not saved
        chat.messages.push(content);
        set(myAddress+"-"+userAddress, JSON.stringify(chat));

        // The content should be chipered if this condition is met
        // Only when we are not sharing keys
        let encryptedContent = content
        if(content.publicKey===undefined || content.publicKey===null){
            encryptedContent.message = _arrayBufferToBase64(await encryptMessage(myAddress, userAddress, content.message)) 
        }

        // publish to the providers proxy if it not saved
        const postID = 0
        const updateID = 0
        const header = await buildHeader(encryptedContent, postID, updateID);
        // eslint-disable-next-line
        const headerVerification = await verify(header, encryptedContent);
        let urlProvider1 = 'http://'+userProviders.provider1+"/"+userAddress+"/chats"
        try{
            // eslint-disable-next-line
            let result = await fetch(urlProvider1, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: encryptedContent,
                        header: header,
                    }
                )
            })
        } catch(err){}
    }
}

export const saveUserPublicKey = async (myAddress, userAddress, publicKey)=>{
    
    let chat = JSON.parse(get(myAddress+"-"+userAddress));
    if(chat.userPublicKey === undefined || chat.userPublicKey === null){
        chat.userPublicKey = publicKey
    }
    set(myAddress+"-"+userAddress, JSON.stringify(chat));
}

export const saveMessage = async (myAddress, userAddress, content) => {
    // // Save as a message
    let chat = JSON.parse(get(myAddress+"-"+userAddress));
    // find if the message is already in
    let isMessageSaved = false
    // eslint-disable-next-line
    chat.messages.some((message) => {
        if (message.messageId === content.messageId && message.address === content.address){
            isMessageSaved = true;
        }
    });
    if(!isMessageSaved){
        // add it if not saved

        // The content should be chipered if this condition is met
        // Only when we are not sharing keys
        let encryptedContent = content 
        let decryptedContent = content;
        if(content.publicKey===undefined || content.publicKey===null){
            decryptedContent.message = await decryptMessage(myAddress, userAddress, _base64ToArrayBuffer(encryptedContent.message))
        }

        chat.messages.push(decryptedContent);
        set(myAddress+"-"+userAddress, JSON.stringify(chat));
    }
}

export const getConversationMessages = async (myAddress, userAddress) =>{
    let chat = JSON.parse(get(myAddress+"-"+userAddress))
    return chat.messages // messages
}


export const encryptMessage = async (myAddress, userAddress, plaintext) => {
    let chat = JSON.parse(get(myAddress+"-"+userAddress));
    if(chat === undefined){
        return;
    } 
    // If the chat exist upload
    let publicKey = await window.crypto.subtle.importKey('jwk', chat.userPublicKey, {name:"RSA-OAEP", hash:"SHA-256"}, true, ["encrypt"]);
    return await encrypt(publicKey, plaintext)
}

export const decryptMessage = async (myAddress, userAddress, encryptedtext) => {
    let chat = JSON.parse(get(myAddress+"-"+userAddress));
    if(chat === undefined){
        return;
    } 
    // If the chat exist upload
    let privateKey = await window.crypto.subtle.importKey('jwk', chat.keypair.privateKey, {name:"RSA-OAEP", hash:"SHA-256"}, true, ["decrypt"]);
    return await decrypt(privateKey, encryptedtext)
}

export const getLastMessageId = (myAddress, userAddress) => {
    let chat = JSON.parse(get(myAddress+"-"+userAddress));
    if(chat === undefined){
        return;
    }
    let myMessages = chat.messages.filter(message => message.address.toLowerCase() === myAddress.toLowerCase());
    let lastMessageId = Math.max(...myMessages.map(message => message.messageId));
    if(lastMessageId === null || lastMessageId === undefined){
        console.log("LAST MESSAGE ID:", lastMessageId)
        lastMessageId = 0;
    }
    // If the chat exist upload
    return lastMessageId;
  }

export const _arrayBufferToBase64 = ( buffer ) => {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}

export const _base64ToArrayBuffer = (base64) => {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }