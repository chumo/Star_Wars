// Node.js script to build the data set data/EpisodesData.json
// from the Star Wars API with sorted and filtered information for the viz.
// The characters from every episode are groupped by their homeworlds

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
    // var filmPlanets = us.map(film.planets,function(d){return us.findWhere(data.planets,{id:d})});
    // var filmPlanetsName = us.map(filmPlanets, function(d){return d.name;});
    // var filmPlanetsDiameter = us.map(filmPlanets, function(d){return d.diameter;});
    // var filmPlanetsPopulation = us.map(filmPlanets, function(d){return d.population;});

    var filmPeople = us.map(film.people,function(d){return us.findWhere(data.people,{id:d})});
    var filmPeoplePlanet = us.map(filmPeople,function(d){return d.planet});
    var filmPeoplePlanetObject = us.map(filmPeoplePlanet,function(d){return us.findWhere(data.planets,{id:d})});
    var filmPeoplePlanetName = us.map(filmPeoplePlanetObject,function(d){return d.name;});

    var filmUniquePlanetsName = us.unique(filmPeoplePlanetName);
    // var filmPeoplePlanetDiameter = us.map(filmPeoplePlanetObject,function(d){return d.diameter;});

    var filmUniquePlanets = us.map(filmUniquePlanetsName,function(d){return us.findWhere(data.planets,{name:d})});
    var filmUniquePlanetsDiameter = us.map(filmUniquePlanets, function(d){return (d.diameter == null || d.diameter == 0) ? 9999 : d.diameter;}); //unknown diameters or 0 are assigned to be 9999
    var filmUniquePlanetsPopulation = us.map(filmUniquePlanets, function(d){return (d.population == null || d.population == 0) ? 999999 : d.population;}); //unknown populations or 0 are assined to be 999999

    var planets = us.map(filmUniquePlanetsName, function(d,i){
        var peopleInPlanet = us.filter(filmPeople,function(person){return d == us.findWhere(data.planets,{id:person.planet}).name;});

        return {
            name:filmUniquePlanetsName[i],
            population:filmUniquePlanetsPopulation[i],
            diameter:filmUniquePlanetsDiameter[i],
            people: us.map(peopleInPlanet,function(person){
                var thisSpecies = us.findWhere(data.species,{id:person.species});
                return {
                    name:person.name,
                    species:(thisSpecies == undefined) ? "unknown" : thisSpecies.name
                };
                })
        };
        });

    return {title:film.title, opening_crawl:film.opening_crawl, planets:planets};
});


var episodesText = JSON.stringify(episodes);

// save (from http://stackoverflow.com/a/2497040/4564295)
var fs = require('fs');
fs.writeFile("../data/EpisodesData.json", episodesText, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
});
