import {verify, buildHeader, verifyHeader} from '../helpers/index'

export class Account {
    
    // ----------------------------------------------------------------------------------- //
    // ------------------------------------- Constructor --------------------------------- //
    // ----------------------------------------------------------------------------------- //
    // eslint-disable-next-line
    constructor(){
        // 
    }

    // ----------------------------------------------------------------------------------- //
    // --------------------------------------- Account ----------------------------------- //
    // ----------------------------------------------------------------------------------- //
    setAddress(address){
        this.address = address;
    }
    getAddress(){
        return this.address;
    }
    setProviders(providers){
        this.providers = providers;
    }
    getProviders(){
        return this.providers;
    }

    // ----------------------------------------------------------------------------------- //
    // ----------------- Watcher Account: person who visits this account ----------------- //
    // ----------------------------------------------------------------------------------- //
    setWatcherAddress(address){
        this.watcherAddress = address;
    }
    getWatcherAddress(){
        return this.watcherAddress;
    }
    setWatcherProviders(providers){
        this.watcherProviders = providers;
    }
    getWatcherProviders(){
        return this.watcherProviders;
    }

    setPostChain1(chain){
        this.postChain1 = chain;
    }
    getPostChain1(){
        return this.postChain1;
    }
    setPostChain2(chain){
        this.postChain2 = chain;
    }
    getPostChain2(){
        return this.postChain2;
    }
    setPostChain3(chain){
        this.postChain3 = chain;
    }
    getPostChain3(){
        return this.postChain3;
    }

    setPostChain(chain){
        this.postChain = chain;
    }
    getPostChain(){
        return this.postChain;
    }

    async getAccountMetadata (url) {
        let response = await fetch(url, {
            method: 'GET',
            cache: 'no-store', 
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let json = await response.json();
        let verification = await verifyHeader(json.metadata.last_header);
        if(!verification){
            return null; // last_header is not a valid header, abort
        } else {
            return json.metadata;
        }
    }

    async getPost (url) {
        let response = await fetch(url, {
            method: 'GET',
            cache: 'no-store', 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return await response.json()
    }

    async downloadPosts (){
        if(this.getProviders() !== undefined ){
            let urlProvider1 = 'http://'+this.getProviders().provider1+'/'+this.getAddress()
            let urlProvider2 = 'http://'+this.getProviders().provider2+'/'+this.getAddress()
            let urlProvider3 = 'http://'+this.getProviders().provider3+'/'+this.getAddress()
            try{
                let metadata = await this.getAccountMetadata(urlProvider1);
                let totalPostsProvider1 = metadata?.last_header.post_id;
                let fetchedPosts = []
                for (let i = totalPostsProvider1; i >= 0; i--) {
                    let post = await this.getPost(urlProvider1+"/"+i)
                    
                    if(await verify(post.header, post.content)){
                        fetchedPosts.push(post)
                    }
                }
                this.setPostChain1(fetchedPosts);
            } catch (err) {
                let failedRequests = window.localStorage.getItem("stats-provider"+1+"-failed-requests");
                if (failedRequests !== null){
                    window.localStorage.setItem("stats-provider"+1+"-failed-requests", parseInt(failedRequests)+1);
                } else {
                    window.localStorage.setItem("stats-provider"+1+"-failed-requests", 1);
                }
                this.setPostChain1([]);
            }
            try{
                let metadata = await this.getAccountMetadata(urlProvider2);
                let totalPostsProvider2 = metadata?.last_header.post_id;
                let fetchedPosts = []
                for (let i = totalPostsProvider2; i >= 0; i--) {
                    let post = await this.getPost(urlProvider2+"/"+i)
                    if(await verify(post.header, post.content)){
                        fetchedPosts.push(post)
                    }
                }
                this.setPostChain2(fetchedPosts);
            } catch (err) {
                let failedRequests = window.localStorage.getItem("stats-provider"+2+"-failed-requests");
                if (failedRequests !== null){
                    window.localStorage.setItem("stats-provider"+2+"-failed-requests", parseInt(failedRequests)+1);
                } else {
                    window.localStorage.setItem("stats-provider"+2+"-failed-requests", 1);
                }
                this.setPostChain2([]);
            }
            try{
                let metadata = await this.getAccountMetadata(urlProvider3);
                let totalPostsProvider3 = metadata?.last_header.post_id;
                let fetchedPosts = []
                for (let i = totalPostsProvider3; i >= 0; i--) {
                    let post = await this.getPost(urlProvider3+"/"+i)
                    if(await verify(post.header, post.content)){
                        fetchedPosts.push(post)
                    }
                }
                this.setPostChain3(fetchedPosts);
            } catch (err) {
                let failedRequests = window.localStorage.getItem("stats-provider"+3+"-failed-requests");
                if (failedRequests !== null){
                    window.localStorage.setItem("stats-provider"+3+"-failed-requests", parseInt(failedRequests)+1);
                } else {
                    window.localStorage.setItem("stats-provider"+3+"-failed-requests", 1);
                }
                this.setPostChain3([]);
            }

            this.mergePostChains();
        }
    }

    async mergePostChains () {
        // TODO: Check chains undefined
    
        // Verify if its version is greater
        let latestPostChain1 = Math.max(...this.getPostChain1().map(o => o.header.post_id));
        let latestPostChain2 = Math.max(...this.getPostChain2().map(o => o.header.post_id));
        let latestPostChain3 = Math.max(...this.getPostChain3().map(o => o.header.post_id));
        let latestPost = Math.max(latestPostChain1 === Infinity ? 0 : latestPostChain1, latestPostChain2 === Infinity ? 0 : latestPostChain2, latestPostChain3 === Infinity ? 0 : latestPostChain3)
        let postChain = [];
        for (let i = latestPost; i >= 0; i--) {
            let postChain1 = this.getPostChain1().find(o => o.header.post_id === parseInt(i));
            let postChain2 = this.getPostChain2().find(o => o.header.post_id === parseInt(i));
            let postChain3 = this.getPostChain3().find(o => o.header.post_id === parseInt(i));
            let maxUpdateId = Math.max(postChain1 ? postChain1?.header.update_id : 0, postChain2 ? postChain2?.header.update_id : 0, postChain3 ? postChain3?.header.update_id : 0);
            if(postChain1?.header.update_id === maxUpdateId){
                postChain.push(postChain1)
            } else if (postChain2?.header.update_id === maxUpdateId){
                postChain.push(postChain2)
            } else if (postChain3?.header.update_id === maxUpdateId){
                postChain.push(postChain3)
            }
        }
        this.setPostChain(postChain);
        console.log("POST Chain", postChain);
    }

    async publishPost (content) {
        let latestPostChain1 = undefined;
        let latestPostChain2 = undefined;
        let latestPostChain3 = undefined;
        let urlProvider1 = 'http://'+this.getProviders().provider1+'/'+this.getWatcherAddress();
        let urlProvider2 = 'http://'+this.getProviders().provider2+'/'+this.getWatcherAddress();
        let urlProvider3 = 'http://'+this.getProviders().provider3+'/'+this.getWatcherAddress();
        try {
            let response = await fetch(urlProvider1, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verifyHeader(json.metadata.last_header)){
                latestPostChain1 = json.metadata.last_header.post_id
            } else {
                latestPostChain1 = 0;
            }
            
        } catch(err) {}
        try {
            let response = await fetch(urlProvider2, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verifyHeader(json.metadata.last_header)){
                latestPostChain2 = json.metadata.last_header.post_id
            } else {
                latestPostChain2 = 0;
            }
            
        } catch(err) {}
        try {
            let response = await fetch(urlProvider3, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verifyHeader(json.metadata.last_header)){
                latestPostChain3 = json.metadata.last_header.post_id
            } else {
                latestPostChain3 = 0;
            }
            
        } catch(err) {}
        let latestPost = Math.max(latestPostChain1 ? latestPostChain1 : 0, latestPostChain2 ? latestPostChain2 : 0, latestPostChain3 ? latestPostChain3 : 0)
        const postID = latestPost+1
        const updateID = 1
        const header = await buildHeader(content, postID, updateID);
        // eslint-disable-next-line
        const headerVerification = await verify(header, content);
    
        
        try { 
            // eslint-disable-next-line
            let result = await fetch(urlProvider1+'/'+postID, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            })
        } catch (err) {}
        try { 
            // eslint-disable-next-line
            let result = await fetch(urlProvider2+'/'+postID, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            })
        } catch (err) {}
        try { 
            // eslint-disable-next-line
            let result = await fetch(urlProvider3+'/'+postID, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            })
        } catch (err) {}
    }

    async checkIsFollowing () {
        if(this.getWatcherProviders() !== undefined && this.getWatcherAddress() !== undefined && this.getAddress() !== undefined ){
            let urlProvider1 = 'http://'+this.getWatcherProviders().provider1+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
            let urlProvider2 = 'http://'+this.getWatcherProviders().provider2+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
            let urlProvider3 = 'http://'+this.getWatcherProviders().provider3+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
            let greatestUpdateID = 0;
            let isFollowing = false;
            try {
                let response = await fetch(urlProvider1, {
                    method: 'GET',
                    cache: 'no-store', 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let json = await response.json()
                if(await verify(json.header, json.content)){
                    if(json.header.update_id>greatestUpdateID){
                        greatestUpdateID = json.header.update_id;
                        isFollowing = json.content.following
                    }
                }   
            } catch(err) {}
            try {
                let response = await fetch(urlProvider2, {
                    method: 'GET',
                    cache: 'no-store', 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let json = await response.json()
                if(await verify(json.header, json.content)){
                    if(json.header.update_id>greatestUpdateID){
                        greatestUpdateID = json.header.update_id;
                        isFollowing = json.content.following
                    }
                }   
            } catch(err) {}
            try {
                let response = await fetch(urlProvider3, {
                    method: 'GET',
                    cache: 'no-store', 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let json = await response.json()
                if(await verify(json.header, json.content)){
                    if(json.header.update_id>greatestUpdateID){
                        greatestUpdateID = json.header.update_id;
                        isFollowing = json.content.following
                    }
                }   
            } catch(err) {}
            return isFollowing;
        }     
    }

    async follow () {
        let urlProvider1 = 'http://'+this.getWatcherProviders().provider1+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
        let urlProvider2 = 'http://'+this.getWatcherProviders().provider2+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
        let urlProvider3 = 'http://'+this.getWatcherProviders().provider3+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
        // Check update-id
        let greatestUpdateID = 0;
        try {
            let response = await fetch(urlProvider1, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verify(json.header, json.content)){
                if(json.header.update_id>greatestUpdateID){
                    greatestUpdateID = json.header.update_id;
                }
                
            }
        } catch(err){}
        try {
            let response = await fetch(urlProvider2, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verify(json.header, json.content)){
                if(json.header.update_id>greatestUpdateID){
                    greatestUpdateID = json.header.update_id;
                }
                
            }
        } catch(err){}
        try {
            let response = await fetch(urlProvider3, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verify(json.header, json.content)){
                if(json.header.update_id>greatestUpdateID){
                    greatestUpdateID = json.header.update_id;
                }
                
            }
        } catch(err){}
        
        const content = {
            address: this.getAddress(),
            following: true
        }
        const postID = 0 //when following chain always to 0 is not used
        const updateID = greatestUpdateID+1;
        const header = await buildHeader(content, postID, updateID);
        // eslint-disable-next-line
        const headerVerification = await verify(header, content);

        // follow
        try {
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
                        content: content,
                        header: header,
                    }
                )
            });
            
        } catch(err) {}
        try {
            // eslint-disable-next-line
            let result = await fetch(urlProvider2, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            });
            
        } catch(err) {}
        try {
            // eslint-disable-next-line
            let result = await fetch(urlProvider3, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            });
            
        } catch(err) {}
    }
    
    async unfollow (urls, address) {
        let urlProvider1 = 'http://'+this.getWatcherProviders().provider1+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
        let urlProvider2 = 'http://'+this.getWatcherProviders().provider2+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
        let urlProvider3 = 'http://'+this.getWatcherProviders().provider3+'/'+this.getWatcherAddress()+'/following/'+this.getAddress()
        // Check update-id
        let greatestUpdateID = 0;
        try {
            let response = await fetch(urlProvider1, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verify(json.header, json.content)){
                if(json.header.update_id>greatestUpdateID){
                    greatestUpdateID = json.header.update_id;
                }
                
            }
        } catch(err){}
        try {
            let response = await fetch(urlProvider2, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verify(json.header, json.content)){
                if(json.header.update_id>greatestUpdateID){
                    greatestUpdateID = json.header.update_id;
                }
                
            }
        } catch(err){}
        try {
            let response = await fetch(urlProvider3, {
                method: 'GET',
                cache: 'no-store', 
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            let json = await response.json()
            if(await verify(json.header, json.content)){
                if(json.header.update_id>greatestUpdateID){
                    greatestUpdateID = json.header.update_id;
                }
                
            }
        } catch(err){}
        
        const content = {
            address: this.getAddress(),
            following: false
        }
        const postID = 0 //when following chain always to 0 is not used
        const updateID = greatestUpdateID+1;
        const header = await buildHeader(content, postID, updateID);
        // eslint-disable-next-line
        const headerVerification = await verify(header, content);

        // follow
        try {
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
                        content: content,
                        header: header,
                    }
                )
            });
            
        } catch(err) {}
        try {
            // eslint-disable-next-line
            let result = await fetch(urlProvider2, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            });
            
        } catch(err) {}
        try {
            // eslint-disable-next-line
            let result = await fetch(urlProvider3, {
                method:'post',
                mode:'cors',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json',
                },
                // TODO: change id, sign the post and hash the content
                body: JSON.stringify(
                    {
                        content: content,
                        header: header,
                    }
                )
            });
            
        } catch(err) {}
    }

    async getFeed (){
        if(this.getProviders() !== undefined ){
            let urlProvider1 = 'http://'+this.getProviders().provider1+'/feed/'+this.getAddress()
            //let urlProvider2 = 'http://'+this.getProviders().provider2+'/'+this.getAddress()
            //let urlProvider3 = 'http://'+this.getProviders().provider3+'/'+this.getAddress()
            try{
                let response = await fetch(urlProvider1, {
                    method: 'GET',
                    cache: 'no-store', 
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                let json = await response.json()
                for(let item of json){
                    if(!await verify(item.header, item.content)){
                        const index = json.indexOf(item);
                        json.splice(index, 1); // 2nd parameter means remove one item only
                    }
                }
                console.log(json)
                return json;

            } catch (err) {}
        }
    }

}