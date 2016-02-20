from pymongo import MongoClient

client = MongoClient('mongodb://emoji:emoji@ds041821.mongolab.com:41821')
db = client.emoji

cursor = db.Emojis.find()

for document in cursor:
    print(document)
