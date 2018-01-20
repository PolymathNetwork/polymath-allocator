# Polymath Allocation Scripts

This repo contains the POLY token allocation addresses for various pools of users. Here they are:

| Supply        | Description           | File  |
| ------------- |:-------------:|:-----:|
| Advisors | Polymath advisors (locked up until August 23rd 2018) | [advisors.csv](/data/advisors.csv)|
| Presale | Presale purchasers with no lockup | [presale.csv](/data/presale.csv) |
| Bonus1 | Presale purchasers with 1 year lockup | [bonus1.csv](/data/bonus1.csv) |
| Bonus2 | Presale purchasers with 2 year lockup | [bonus2.csv](/data/bonus2.csv) |
| Bonus3 | Presale purchasers with 3 year lockup | [bonus3.csv](data/bonus3.csv) |

## How to update

Submit a Pull Request with an update. Contact sukhveer@polymath.network if you are having trouble with this.

## I noticed something wrong with my allocation

Please contact the team(follow up with your team contact) **immediately**.

CHANGES CAN NOT BE MADE AFTER JANAURY 25TH, 2018!

## How to run the script

There are two parts:

1) Uploading to database, allows users to check their balances prior to the distribution at [token.polymath.network](https://token.polymath.network). This can be updated by cloning the repo, dropping the config files into this folder and calling each script in the /database folder.

2) Uploading the allocations to the ethereum contracts allows the allocations to be locked in to the [POLY distribution](https://github.com/PolymathNetwork/polymath-token-distribution) contracts.
