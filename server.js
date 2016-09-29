var express = require('express');

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.delete = function(id) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].id == id) {
			this.items.splice(i,1);
		}
	}
};

Storage.prototype.update = function(itemName, itemId) {
	for (var i = 0; i < this.items.length; i++) {
		if (this.items[i].id == itemId) {
			this.items[i] = { name: itemName, id: itemId};
		}
	}
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});

app.delete('/items/:id', function(request, response){

	var id = request.params.id;

    storage.delete(id);
    response.status(200).json(storage.items);
});

app.put('/items/:id', jsonParser, function(request, response){

	if (!request.body) {
        return response.sendStatus(400);
    }

    var name = request.body.name;

    storage.update(name, request.params.id);
    response.status(200).json(storage.items);
});


app.listen((process.env.PORT || 3030), function(){
	console.log("App is running at http://localhost:3030")
});