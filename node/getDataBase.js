// Node.js script to build the data set data/StarWarsData.json from the Star Wars API with the selected information for the viz

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();
var us = require("underscore");

// helper functions
function getJSON(url){ // return a json from a synchronous http request
    req.open("GET",url,false);
    req.send();
    return JSON.parse(req.responseText);
}

function id(s){ // get id number from a string like http://swapi.co/api/people/1/"
    return parseInt(s.toString().split('/')[5]);
}

// Retrieve the data
var data = {"people":[], "species":[], "planets":[], "films":[]};

for (var i = 1; i < 89; i++) { // people
    if (i != 17) {// item 17 seems to be missing
        var d = getJSON("http://swapi.co/api/people/"+i+"/");
        var j = {id:i, name:d.name, planet:id(d.homeworld), species:id(d.species)};
        data.people.push(j);
    }
}

for (var i = 1; i < 38; i++) { // species
    var d = getJSON("http://swapi.co/api/species/"+i+"/");
    var j = {id:i, name:d.name};
    data.species.push(j);
}

for (var i = 1; i < 62; i++) { // planets
    var d = getJSON("http://swapi.co/api/planets/"+i+"/");
    var j = {id:i, name:d.name, diameter:parseInt(d.diameter), population:parseInt(d.population)};
    data.planets.push(j);
}

for (var i = 1; i < 8; i++) { // films
    var d = getJSON("http://swapi.co/api/films/"+i+"/");
    var j = {
        id:parseInt(d.episode_id),
        title:d.title,
        opening_crawl:d.opening_crawl,
        people:us.map(d.characters,function(d){return id(d);}),
        planets:us.map(d.planets,function(d){return id(d);}),
        species:us.map(d.species,function(d){return id(d);})
    };
    data.films.push(j);
}

var dataText = JSON.stringify(data);

// save (from http://stackoverflow.com/a/2497040/4564295)
var fs = require('fs');
fs.writeFile("../data/StarWarsData.json", dataText, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
