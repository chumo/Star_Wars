// Node.js script to build the data set data/EpisodesData.json from the Star Wars API with sorted and filtered information for the viz

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var req = new XMLHttpRequest();
var us = require("underscore");

// helper functions
function getJSON(url){ // return a json from a synchronous http request
    req.open("GET",url,false);
    req.send();
    return JSON.parse(req.responseText);
}

// Retrieve the data
var data = getJSON("https://raw.githubusercontent.com/chumo/Star_Wars/gh-pages/data/StarWarsData.json");
var films = us.sortBy(data.films,"id");

var episodes = us.map(films,function(film){
    var filmPlanets = us.map(film.planets,function(d){return us.findWhere(data.planets,{id:d})});
    var filmPlanetsName = us.map(filmPlanets, function(d){return d.name;});
    var filmPlanetsDiameter = us.map(filmPlanets, function(d){return d.diameter;});
    var filmPlanetsPopulation = us.map(filmPlanets, function(d){return d.population;});
    console.log(filmPlanets)

    var planets = us.map(filmPlanets, function(d,i){
        return {
            name:filmPlanetsName[i],
            population:filmPlanetsPopulation[i],
            diameter:filmPlanetsDiameter[i]
        };
        });

    return {title:film.title, opening_crawl:film.opening_crawl, planets:planets};
});

//
// var filmPeople = us.map(film.people,function(d){return us.findWhere(data.people,{id:d})});
// var filmPeoplePlanet = us.map(filmPeople,function(d){return d.planet});
// var filmPeoplePlanetObject = us.map(filmPeoplePlanet,function(d){return us.findWhere(data.planets,{id:d})});
// var filmPeoplePlanetName = us.map(filmPeoplePlanetObject,function(d){return d.name;});
// var filmPeoplePlanetDiameter = us.map(filmPeoplePlanetObject,function(d){return d.diameter;});


var episodesText = JSON.stringify(episodes);

// save (from http://stackoverflow.com/a/2497040/4564295)
var fs = require('fs');
fs.writeFile("../data/EpisodesData.json", episodesText, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
