# Polymath Allocation Scripts

This repo contains the POLY token allocation addresses for various pools of users. Here they are:

| Supply        | Description           | File  | Num |
| ------------- |:-------------:|:-----:|:----:|
| Founders | Polymath founders | [founders.csv](/data/founders.csv) | 2 |
| Advisors | Polymath advisors | [advisors.csv](/data/advisors.csv)| 3 |
| Reserve | Polymath reserve | [reserve.csv](/data/reserve.csv) | 4 |
| Presale | Presale purchasers | [presale.csv](/data/presale.csv) | 5 |
| Bonus1 | Presale sale bonus 1 | [bonus1.csv](/data/bonus1.csv) | 6 |
| Bonus2 | Presale sale bonus 2 | [bonus2.csv](/data/bonus2.csv) | 7 |
| Bonus3 | Presale sale bonus 3 | [bonus3.csv](data/bonus3.csv) | 8 |

## Pre contract deploy

To allow participants to check their balances at token.polymath.network/check, clone the repo, drop the config files into the root folder and call each script in the /database folder.

## Setting the allocations

Once the PolyDistribution contract is live, the following steps can be taken:

1) Ensure all csv files in /data are correct

2) To set all presale allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 0` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 0` to verify for correctness.

3) To set all founder allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 1` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 1` to verify for correctness.

4) To set all advisor allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 3` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 3` to verify for correctness.

5) To set all reserve allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 4` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 4` to verify for correctness.

6) To set reserve allocation run `node ./scripts/allocate.js <PolyDistribution contract address> 5` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 5` to verify for correctness.

6) To set all bonus1 allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 6` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 6` to verify for correctness.

7) To set all bonus2 allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 7` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 7` to verify for correctness.

8) To set all bonus3 allocations run `node ./scripts/allocate.js <PolyDistribution contract address> 8` and `node ./scripts/verify_allocations.js <PolyDistribution contract address> 8` to verify for correctness.

## Distributing the allocations

Once the startTime has passed and tokens become tradeable, the tokens can be distributed by running:

`node ./scripts/distribute.js <PolyDistribution contract address> <0-8>`

# Running the airdrop

The airdrop can be completed by running `node ./scripts/airdrop.js <PolyDistribution contract address>` and verified for correctness by running `./node ./scripts/verify_airdrop.js <PolyDistribution contract address>`.
