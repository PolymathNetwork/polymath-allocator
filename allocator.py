import csv
import time
import pandas as pd
import requests
import json
import pymongo
import configparser

config = configparser.ConfigParser()
config.read('config.ini')

try:
    client = pymongo.MongoClient(config["DEFAULT"]["MONGO_URL"], ssl_ca_certs='./cert.pem', connectTimeoutMS=30000, socketTimeoutMS=None)
    db = client.main
    collection = db.airdrop
    client.server_info()
except pymongo.errors.ServerSelectionTimeoutError as err:
    print(err)

def uploadAllocations(list, supply):
    with open(list, 'rb') as csvfile:
        addresses = pd.read_csv(csvfile)
        for index, row in addresses.iterrows():
            # Update entry in mongo
            if (row.address):
                address = str(row.address).lower()
                print(address)
                try:
                    post_id = collection.update({ "address": address}, {"$set": {"supply": supply, "allocation": row.allocation}}, upsert=True)
                    print (address +' updated ' + str(post_id))
                except pymongo.errors.WriteError as err:
                    print('Failed to insert eth address', address, row.address, err)

# Upload advisors
supply = 3
list = '../allocations/advisors.csv'
print('~~~~Allocating Advisor Tokens~~~~')
uploadAllocations(list, supply)

# Upload presale
supply = 5
list = '../allocations/presale.csv'
print('~~~~Allocating Presale Tokens~~~~')
uploadAllocations(list, supply)

# Upload presale with 1 year lockup
supply = 6
list = '../allocations/bonus1.csv'
print('~~~~Allocating Presale (with 1 year lockup) Tokens~~~~')
uploadAllocations(list, supply)

# Upload presale with 2 year lockup
supply = 7
list = '../allocations/bonus2.csv'
print('~~~~Allocating Presale (with 2 year lockup) Tokens~~~~')
uploadAllocations(list, supply)

# Upload presale with 3 year lockup
supply = 8
list = '../allocations/bonus3.csv'
print('~~~~Allocating Presale (with 3 year lockup) Tokens~~~~')
uploadAllocations(list, supply)
