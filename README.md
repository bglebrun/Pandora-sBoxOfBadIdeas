###Get Injected!

Simple api that listens on default port 80, takes in json requests as format {{"message": "Your message"}} in paths:

- "/" GET: is default, nothing happens except forbidden response from server
- "/rand" GET: gets a random document from the mongoose created collection in the database
-"/noCastRand" GET: gets random document from the nodejs formatted collection in the database
-"/noCastInsert" POST: Takes in json, does not directly cast it inside of node or do any sanitization other than what nodejs does by itself.
-"/ideas/:id" GET: gets idea by ID
-"/ideas/message/:message" GET: gets idea by message"
-"/mongooseInsert" GET: does mongoose handled insert into the database
