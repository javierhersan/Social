export const get = (key) =>{
    return window.localStorage.getItem(key); 
}

export const set = (key, value) =>{
    window.localStorage.setItem(key, value);
}

export const remove = (key) =>{
    window.localStorage.removeItem(key);
}

export const getKey = (index) =>{
    return window.localStorage.key(index);
}

export const clearDB = () =>{
    window.localStorage.clear();
}

// Get keys that include the following string
export const getKeysStartingBy = (string) => {
    let keys = []
    for (let i = 0; i < window.localStorage.length; i++){
        if(getKey(i)?.includes(string) ){
            keys.push(getKey(i));
        }
    }
    return keys;
}

