let DNS = artifacts.require("DNS");

module.exports = function(deployer) {
    deployer.deploy(DNS, "v1.0.0");
};
