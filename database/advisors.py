import csv
import time
import pandas as pd
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

allocated = 0

with open('../data/advisors.csv', 'rb') as csvfile:
    addresses = pd.read_csv(csvfile)
    for index, row in addresses.iterrows():
        # Check that address is valid
        try:
            allocation = int(row.allocation)
        except:
            allocation = False
        if (row.address and allocation and isinstance(allocation,int)):
            allocation = int(row.allocation)
            address = str(row.address).lower()
            allocated += allocation
            try:
                post_id = collection.update({ "address": address}, {"$set": {"supply": supply, "allocation": row.allocation}}, upsert=True)
                print (address +' is allocated '+ str(allocation))
            except pymongo.errors.WriteError as err:
                print('Failed to insert eth address', address, row.address, err)

print ('---------------------------------------------------')
print ('-----------Allocation script complete--------------')
print ('---------------------------------------------------')
print('------- Allocated ' + str(allocated) + ' POLY to advisors -------')
print ('---------------------------------------------------')
