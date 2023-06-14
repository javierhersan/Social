// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.16;

contract DNS{
    // Contract version
    string public version;

    // Development Team address
    address public devTeamAddress;

    // Mapping: username -> DNSData
    mapping (string => address) public dns;

    struct Provider {
        string provider1;
        string provider2;
        string provider3;
    }

    mapping (address => Provider) public providers;

    // Constructor for deploying the smart contract
    constructor(string memory _version) {
        require(bytes(_version).length != 0, "Empty parameter: version");
        version = _version;
        devTeamAddress = msg.sender;
    }

    // 
    receive() external payable {
        revert("This contract doesn't accept ethers");
    }

    // Register a new username
    function register(string memory _username) public {
        require(bytes(_username).length != 0, "Empty parameter: username");
        if(dns[_username] == address(0x0)){
            dns[_username] = msg.sender;
        }
    }

    function setProvider(string memory _providerIP, uint _provider) public {
        require(bytes(_providerIP).length != 0, "Empty parameter: Provider IP");
        require((_provider == 1) || (_provider == 2) || (_provider == 3), "Parameter Error: Provider must be 1, 2 or 3");
        if(_provider == 1){
            providers[msg.sender].provider1 = _providerIP;
        } else if(_provider == 2){
            providers[msg.sender].provider2 = _providerIP;
        } else if(_provider == 3){
            providers[msg.sender].provider3 = _providerIP;
        }
    }
}