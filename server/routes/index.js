var express = require('express');
var router = express.Router();

var helpers = require('../helpers/index');
var verify = helpers.verify;

var Ajv = require('ajv');
const ajv = new Ajv({strict: false});
var schema = require('../database/schema')
var metadata_schema = require('../database/metadata_schema')
const validate = ajv.compile(schema);
const validateMetadataSchema = ajv.compile(metadata_schema);

// Connection to the smart contract
var Web3 = require('web3');
const web3 = new Web3("http://localhost:7545");
var DNS = require("../contracts/DNS.json")
const DNSContract = new web3.eth.Contract(DNS.abi, DNS.networks[5777].address);

// TODO: https://github.com/trufflesuite/drizzle/issues/145
// web3.js vs. ethers.js
// https://medium.com/l4-media/announcing-ethers-js-a-web3-alternative-6f134fdd06f3
// One major difference between ethers.js and web3 is how they handle key management and interaction with the ethereum blockchain. Web3 assumes that there is a local node connected to the application. That node is assumed to store keys, sign transactions, and interact with and read the ethereum blockchain. In reality, this is not often the case — most users are not running geth locally. Metamask effectively emulates that environment through a browser application, and so most web3 apps require Metamask to hold keys, sign transactions, and interact with the ethereum mainnet.
// Ethers.js takes a different approach that we believe gives developers more flexibility. Ethers.js separates the “node” into two separate roles:
// A “wallet” that holds keys and signs transaction, and
// A “provider” that serves as an anonymous connection to the ethereum network, checking state and sending transactions

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(drizzle.store.getState().drizzleStatus.initialized)
  res.render('index', { title: 'Express' });
});

// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //
// ---------------------------------------------------------------------------------------- //
let database = [
  {
    account:"0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1",
    posts:[
      {
        content: {
          first_name: 'Javier',
          last_name: 'Hernández Sánchez',
          description: "Let's go!"
        },
        header: {
          signature: '0x325596c9fe0f843f85f0bb0162497751b6363fdd2d8fc63161988847eb6e2b226939cdc30a3b0b82e7a6fd36d0ac16b16d99514d1497b39fe6a5c015b497c72301',
          post_id: 0,
          update_id: 1,
          address: '0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1',
          output_hash: '0x550d7d52f8b4e9890ffd3bfaeb90e7bed50d75297805d98ae74c09611d9f7788'
        }
      },
      {
        content:"Embrace decentralization!",
        header: {
          signature: "0x22c34a10eb1f60c139b35826e0f6b396b0c4eb3c4048002f09164ab133a8500a5ccceceb787fb23eb071dbf27face3004afb13c9534c2587e722e4ca4a35112301",
          post_id: 1,
          update_id: 1,
          address: "0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1",
          output_hash: "0xe89e00982fca4fa3e19d4c1dbb2a5464c163c8366b5a20e994f42f13a36da0c6",
        }
      },
      {
        content:"Fix the world with decentralization!",
        header: {
          signature: "0x5fcbc4970043204a7ebee6d50f1788c14f9070cbe6bc3d13f9371e3f93de6b74563098d8cb96183760f22c306ef8edd377be0792f5e641b46e9a9e0b32a59b9701",
          post_id: 2,
          update_id: 1,
          address: "0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1",
          output_hash: "0x59d5ddbef2e7ab9f6185a35f4f6abc66cc4ecf9383e64d6a9995c4f0b7004bb7",
        }
      },
      // {
      //   content: 'New post!',
      //   header: {
      //     signature: '0x0239e26530f2249cd4af847f61fd80d97985f7852e1ff602bc3a7ddf31bd57192be9866c5f05605051a522073f1ed4897bac2475b213da179e0fdf7594ec487300',
      //     post_id: 3,
      //     update_id: 1,
      //     address: '0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1',
      //     output_hash: '0xfe432e0188d454cd432c2421f6a4d87db80fdec1ea4ff94ad53f3745126039c4'
      //   }
      // },
      // {
      //   content:"Fake post!",
      //   header: {
      //     signature: "0x5fcbc4970043204a7ebee6d50f1788c14f9070cbe6bc3d13f9371e3f93de6b74563098d8cb96183760f22c306ef8edd377be0792f5e641b46e9a9e0b32a59b9701",
      //     post_id: 3,
      //     update_id: 1,
      //     address: "0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1",
      //     output_hash: "0x59d5ddbef2e7ab9f6185a35f4f6abc66cc4ecf9383e64d6a9995c4f0b7004bb7",
      //   }
      // },
      // {
      //   content: 'Another one!',
      //   header: {
      //     signature: '0x7b0b136cac185177d79865d1e5002c7d93c604feea1e1e27eb9977a2692ec6055274eeeb5e5960bfa573b45bf72b84d64f9559058991c7b3713ab4b073b39db600',
      //     post_id: 4,
      //     update_id: 1,
      //     address: '0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1',
      //     output_hash: '0xb7289262f99fce8af7be2352e381a6dafc2efc23a482d97684bec93944fddfb5'
      //   }
      // },
    ],
    following:[
      {
        content: {
          address: '0x62c0bf99ce1496a9656df8214f298F103C3a31ca',
          following: true
        },
        header: {
          signature: '0x900e9a49d296e0b40257c5e87da4f601f8ba0d9e180da512d22068b95691242a31ee281c5d3eb6fb57a3c6ec39721a9aa62853a83f9add38154ad4be251e73d400',
          post_id: 0,
          update_id: 1,
          address: '0x87A1F179A2d2272f2Fc326fFAFcB12Eca6C867a1',
          output_hash: '0x8c3544aa49e701be75ba73b1cbadccffd9071e878a1919ed936aac9941cf1527'
        }
      },
    ],
    chats:[]
  },
  {
    account: '0x62c0bf99ce1496a9656df8214f298F103C3a31ca',
    posts: [ 
      {
        content: {
          first_name: 'Carlos',
          last_name: '',
          description: 'We could be heroes!'
        },
        header: {
          signature: '0x3ec0f934d2de09c68cf101f862c07988e768fce8ae973fbb9f9307e6ed3ffd5933c89ef9368e55eb300a755a7d18af57a85664aee30cc1a395a36b48967bd45401',
          post_id: 0,
          update_id: 1,
          address: '0x62c0bf99ce1496a9656df8214f298f103c3a31ca',
          output_hash: '0x7b86cffd63b5af3840f81af78ea107e758657ace0a4519ed4cddd163ae44d505'
        }
      },
      {
        content: 'My first post!',
        header: {
          signature: '0xd9e4a596a22374c9a7c25d928e3fbfac20410a44eb3f0451598aa7dd0e58b5d929ff6079e64b942a950b12d0baf4d5bd2a0b727c2eb89d473108286e19ea26ef01',
          post_id: 1,
          update_id: 1,
          address: '0x62c0bf99ce1496a9656df8214f298f103c3a31ca',
          output_hash: '0x3775ca54600bfd711ce33156338881e9e6fcbf9e6ea5449ae1df66604f955e39'
        }
      }
    ],
    following: [],
    chats:[]
  },
  {
    account: '0xc4ff550e2b0c247c6c7547a5e1b8f6e22a757b4b',
    posts: [ 
      {
        content: {
          first_name: 'Enterprise XYZ',
          last_name: '',
          description: 'Official account of Enterprise XYZ'
        },
        header: {
          signature: '0x8b11a208f1f0b9350aad1cb3d359d25eaa41e0dff7ed83c5c03a1d96bb3c9ffb2c81717ec66e2882cbfefa1eab1fa94810e759a16e74630418325813f5a8d82a00',
          post_id: 0,
          update_id: 1,
          address: '0xc4ff550e2b0c247c6c7547a5e1b8f6e22a757b4b',
          output_hash: '0x77221c23bf57fe8dc2408b92bd077febee274eb222255a4b6554d4ea6e5df3e5'
        }
      },
      {
        content: 'Buy this new product, limited edition only',
        header: {
          signature: '0x0f82c91cb789f7cee732396ea9f3b24ab56e5e61e431105e009364b8c6da091c764e4865d39c6c54af91e28e2215e44bc5de26719446a9abbd1485981b20c6df01',
          post_id: 1,
          update_id: 1,
          address: '0xc4ff550e2b0c247c6c7547a5e1b8f6e22a757b4b',
          output_hash: '0x5045921868faaf8eac1ce83d917b2edfff78d1e9786994c0a50766a87cd24b78'
        }
      }
    ],
    following: [],
    chats:[]
  },
]

// -------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------//
// --------------------- Get chats --------------------- //
// ------------------------------------------------------//
router.get('/:address/chats', function(req, res, next) {
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  if(account === undefined){
    res.sendStatus(404);
    return;
  }
  res.json(account.chats);
  // delete chats

});

// ------------------------------------------------------//
// -------------------- Post chats --------------------- //
// ------------------------------------------------------//
router.post('/:address/chats', async function(req, res, next) {
  // Verification: the req.body json is correct and follows the json schema
  if(!validate(req.body)){
    res.sendStatus(400);
    return;
  }
  
  // Verification: header matches content, output hash and digital signature
  if(!await verify(req.body.header, req.body.content)){
    console.log(req.body)
    res.sendStatus(400);
    return;
  }

  // Save the chat (Proxy)
  database.some((account) => {
    if (account.account.toLowerCase() === req.params.address.toLowerCase()){
         //change the value here
         account.chats.push(req.body);
         res.sendStatus(200);
         return true;    //breaks out of he loop
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------//
// --------------------- Get feed ---------------------- //
// ------------------------------------------------------//
router.get('/feed/:address', async function(req, res, next) {

  // URL and PORT of this server provider
  var PORT = req.app.settings.port;
  var URL = 'localhost:'+PORT;

  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());

  // If account is undefined dont allow
  if(account === undefined){
    res.sendStatus(404);
    return;
  }

  // Posts that are going to be in the feed
  var feedPosts = []

  // Following accounts post
  for(following of account.following){
    if(following.content.following){
      let providers = await DNSContract.methods.providers(following.content.address.toLowerCase()).call()
      if(providers.provider1 === URL || providers.provider2 === URL || providers.provider3 === URL){
        // We are the provider of that account: Fast recommendation
        let followingAccount = database.find(o => o.account.toLowerCase() === following.content.address.toLowerCase());
        if(followingAccount.posts.length-1 > 0){
          feedPosts.push(followingAccount.posts[followingAccount.posts.length-1]);
        }
      } else {
        // We are not the provider of that account: Slow recommendation
      }
    }
  }

  // Advertisement and recommended posts
  advertisingAccountAddress = '0xc4ff550e2b0c247c6c7547a5e1b8f6e22a757b4b';
  advertisementPostID = 1;
  let advertisingAccount = database.find(o => o.account.toLowerCase() === advertisingAccountAddress.toLowerCase());
  if(advertisingAccount === undefined){
    //
  } else {
    post = advertisingAccount.posts.find(o => o.header.post_id === parseInt(advertisementPostID));
    if(post === undefined){
      //
    } else {
      feedPosts.push(post);
    }
  }
  res.json(feedPosts);
});

// -------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------//
// ------------------ Account Metadata ----------------- //
// ------------------------------------------------------//
router.get('/:address', function(req, res, next) {
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  let last_post = account.posts.reduce((prev, curr) => { 
    return (prev.header.post_id > curr.header.post_id) ? prev : curr;
  });
  res.json({
              metadata:{
                last_header:last_post.header,
              }
            });
});

// ------------------------------------------------------//
// --------------------- Get post ---------------------- //
// ------------------------------------------------------//
router.get('/:address/:id', function(req, res, next) {
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  if(account === undefined){
    res.sendStatus(404);
    return;
  }
  post = account.posts.find(o => o.header.post_id === parseInt(req.params.id));
  if(post === undefined){
    res.sendStatus(404);
  } else {
    res.json(post);
  }
});

// ------------------------------------------------------//
// -------------------- Publish post ------------------- //
// ------------------------------------------------------//
router.post('/:address/:id', async function(req, res, next) {
  // Verification: the req.body json is correct and follows the json schema
  if(!validate(req.body)){
    res.sendStatus(400);
    return;
  }
  // Verification: the post id of the header doesn't match with the id of the url
  if(req.body.header.post_id !== parseInt(req.params.id)){
    res.sendStatus(400);
    return;
  }
  
  // Verification: post-id does not exist
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  if(account === undefined){
    database.push({
      account:req.params.address.toLowerCase(),
      posts:[],
      following:[],
      chats:[]
    })
  } else {
    post = account.posts.find(o => o.header.post_id === parseInt(req.params.id));
    if(post !== undefined){
      res.sendStatus(400);
      return;
    }
  }
  
  // Verification: header matches content, output hash and digital signature
  if(!await verify(req.body.header, req.body.content)){
    console.log(req.body)
    res.sendStatus(400);
    return;
  }
  // Publish the post
  database.some((account) => {
    if (account.account.toLowerCase() === req.params.address.toLowerCase()){
         //change the value here
         console.log(req.body)
         account.posts.push(req.body);
         res.sendStatus(200);
         return true;    //breaks out of he loop
    }
  });
});

// ------------------------------------------------------//
// -------------------- Update post -------------------- //
// ------------------------------------------------------//
router.put('/:address/:id', async function(req, res, next) {
  // Verification: the req.body json is correct and follows the json schema
  if(!validate(req.body)){
    res.sendStatus(400);
    return;
  }
  // Verification: the post id of the header doesn't match with the id of the url
  if(req.body.header.post_id !== parseInt(req.params.id)){
    res.sendStatus(400);
    return;
  }
  // Verification: post-id exist
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  post = account.posts.find(o => o.header.post_id === parseInt(req.params.id));
  if(post === undefined){
    res.sendStatus(400);
    return;
  }
  // Verification: header matches content, output hash and digital signature
  if(!await verify(req.body.header, req.body.content)){
    res.sendStatus(400);
    return;
  }
  // Verification: update-id is greater than the previous update-id
  if(req.body.header.update_id <= post.header.update_id){
    res.sendStatus(400);
    return;
  }
  database.some((account) => {
    if (account.account.toLowerCase() === req.params.address.toLowerCase()){
         //change the value here
         account.posts[req.body.header.post_id] = req.body;
         res.sendStatus(200);
         return true;    //breaks out the loop
    }
  });
});

// TODO: Verify the req.body and post header before deleting it
// Sería como un update en realidad pero poniendo el contenido vacío
// ------------------------------------------------------//
// -------------------- Delete post -------------------- //
// ------------------------------------------------------//
router.delete('/:address/:id', async function(req, res, next) {
  // Verification: the req.body json is correct and follows the json schema
  if(!validate(req.body)){
    res.sendStatus(400);
    return;
  }
  // Verification: the post id of the header doesn't match with the id of the url
  if(req.body.header.post_id !== parseInt(req.params.id)){
    res.sendStatus(400);
    return;
  }
  // Verification: post-id exist
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  post = account.posts.find(o => o.header.post_id === parseInt(req.params.id));
  if(post === undefined){
    res.sendStatus(400);
    return;
  }
  // Verification: header matches content, output hash and digital signature
  if(!await verify(req.body.header, req.body.content)){
    res.sendStatus(400);
    return;
  }
  // Verification: update-id is greater than the previous update-id
  if(req.body.header.update_id <= post.header.update_id){
    res.sendStatus(400);
    return;
  }
  database.some((account) => {
    if (account.account.toLowerCase() === req.params.address.toLowerCase()){
         //change the value here
         account.posts.push(req.body);
         res.sendStatus(200);
         return true;    //breaks out of he loop
    }
  });
});

// -------------------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------//
// ------------------- Get following ------------------- //
// ------------------------------------------------------//
router.get('/:address/following/:followingAddress', function(req, res, next) {
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  following = account.following.find(o => o.content.address.toLowerCase() === req.params.followingAddress.toLowerCase());
  if(following === undefined){
    res.sendStatus(404);
  } else {
    res.json(following);
  }
});

// ------------------------------------------------------//
// ------------------- Following post ------------------ //
// ------------------------------------------------------//
router.post('/:address/following/:followingAddress', async function(req, res, next) {
  // Verification: the req.body json is correct and follows the json schema
  if(!validate(req.body)){
    res.sendStatus(400);
    return;
  }
  // Verification: the post id of the header doesn't match with the id of the url
  if(req.body.content.address.toLowerCase() !== req.params.followingAddress.toLowerCase()){
    res.sendStatus(400);
    return;
  }

  // Verification: update-id is greater than the previous update-id
  let account = database.find(o => o.account.toLowerCase() === req.params.address.toLowerCase());
  following = account.following.find(o => o.content.address.toLowerCase() === req.params.followingAddress.toLowerCase());
  if(following !== undefined){
    if(req.body.header.update_id <= following.header.update_id){
      res.sendStatus(400);
      return;
    }
  }

  // Verification: header matches content, output hash and digital signature
  if(!await verify(req.body.header, req.body.content)){
    res.sendStatus(400);
    return;
  }

  // Publish the following
  database.some((account) => {
    if (account.account.toLowerCase() === req.params.address.toLowerCase()){
      //change the value here
      const index = account.following.findIndex((accountFollowing) => {
        return accountFollowing.content.address.toLowerCase() === req.params.followingAddress.toLowerCase();
      });

      if (index !== -1) {
        account.following[index] = req.body;
        res.sendStatus(200);
      } else {
        account.following.push(req.body);
        res.sendStatus(200);
      }

    }
  });
});

module.exports = router;