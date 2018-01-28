var fs = require('fs');
var csv = require('fast-csv');
var BigNumber = require('bignumber.js');

const polyDistributionArtifacts = require('../build/contracts/PolyDistribution.json');
const contract = require('truffle-contract');
let PolyDistribution = contract(polyDistributionArtifacts);
const Web3 = require('web3');


if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

PolyDistribution.setProvider(web3.currentProvider);
//dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
if (typeof PolyDistribution.currentProvider.sendAsync !== "function") {
  PolyDistribution.currentProvider.sendAsync = function() {
    return PolyDistribution.currentProvider.send.apply(
      PolyDistribution.currentProvider, arguments
    );
  };
}

let polyDistributionAddress = process.argv.slice(2)[0];
let ALLOC_TYPE = parseInt(process.argv.slice(2)[1]);
if(!ALLOC_TYPE) ALLOC_TYPE = 0;
let allocData = new Array();

async function distributeTokens() {

  console.log(`
    --------------------------------------------
    ---------Performing allocations ------------
    --------------------------------------------
  `);

    var sumDistributed = 0;
    var sumAccountsDistributed = 0;

    let accounts = await web3.eth.getAccounts();
    let userBalance = await web3.eth.getBalance(accounts[0]);

    let polyDistribution = await PolyDistribution.at(polyDistributionAddress);
    console.log(allocData);
    let block = await web3.eth.getBlock("latest");
    let currentTime = block.timestamp;
    console.log("Current block timestamp:",currentTime);

    for(var i = 0;i< allocData.length;i++){
        let prevAllocation = await polyDistribution.allocations(allocData[i][0],{from:accounts[0]});

        if(prevAllocation[3].toNumber() == 0){
          console.log('\x1b[31m%s\x1b[0m',"SKIPPED token distribution for account:",allocData[i][0]," No allocation has been made to this account");

        }else if(currentTime < prevAllocation[1].toNumber()){
          console.log('\x1b[31m%s\x1b[0m',"SKIPPED token distribution for account:",allocData[i][0],". Cliff unlock date not reached:", prevAllocation[1].toString(10));

        }else if(prevAllocation[4].toNumber() >= prevAllocation[3].toNumber()){
          console.log('\x1b[31m%s\x1b[0m',"SKIPPED token distribution for account:",allocData[i][0],". All tokens already claimed", prevAllocation[4].toString(10));

        }else{
          try{
            console.log("Distributing vested tokens for account:",allocData[i][0]);

            let receipt = await polyDistribution.transferTokens(allocData[i][0],{from:accounts[0], gas:200000, gasPrice: 10000000000});
            if(receipt && receipt.logs.length >0){
              let tokensClaimed = receipt.logs[0].args._amountClaimed.times(10 ** -18).toString(10);
              console.log("Distributed", tokensClaimed, "tokens for account:",allocData[i][0]);
              sumDistributed += parseInt(tokensClaimed);
              sumAccountsDistributed +=1;
            }else{
              console.log('\x1b[31m%s\x1b[0m',"Failed to distribute vested POLY tokens for account:",allocData[i][0]);
            }

          } catch (err){
            console.log(err);
          }
        }
    }

    console.log('\x1b[32m%s\x1b[0m',"Successfully distributed",sumDistributed, "POLY tokens to ", sumAccountsDistributed,"accounts");

}


function readFile() {
  var stream;
  //console.log(ALLOC_TYPE, "=====");
  switch (ALLOC_TYPE) {
      case 0: //PRESALE
          stream = fs.createReadStream("data/presale.csv");
          break;
      case 1: //FOUNDER
          stream = fs.createReadStream("data/founders.csv");
          break;
      case 2: // AIRDROP
          break;
      case 3: // ADVISOR
          stream = fs.createReadStream("data/advisors.csv");
          break;
      case 4: // RESERVE
          stream = fs.createReadStream("data/reserve.csv");
          break;
      case 5: // BONUS1
          stream = fs.createReadStream("data/bonus1.csv");
          break;
      case 6: // BONUS2
          stream = fs.createReadStream("data/bonus2.csv");
          break;
      case 7: // BONUS3
          stream = fs.createReadStream("data/bonus3.csv");
          break;
      default:

  }


  let index = 0;
  let batch = 0;

  console.log(`
    --------------------------------------------
    ------------- Parsing csv file -------------
    --------------------------------------------
    ******** Removing beneficiaries without tokens or address data
  `);


  var csvStream = csv()
      .on("data", function(data){
          let isAddress = web3.utils.isAddress(data[0]);
          if(isAddress && data[0]!=null && data[0]!='' ){
            data[1] = parseInt(data[1]);
            allocData.push([data[0],data[1]]);
          }
      })
      .on("end", function(){
           //Add last remainder batch
           //console.log(allocData);
           distributeTokens();
      });

  stream.pipe(csvStream);
}

if(polyDistributionAddress){
  readFile();
}else{
  console.log("Please run the script by providing the address of the PolyDistribution contract");
}
