// OLDER APPROACH, WITH d3.json (so, only for the browser) AND WITH RECURSIVENESS TO GET AROUND ASYNCRONOUS REQUESTS

        films.push({
            id:data.episode_id,
            title:data.title,
            opening_crawl:data.opening_crawl,
            people:us.map(data.characters,function(d){return d.split('/')[5];}),
            planets:us.map(data.planets,function(d){return d.split('/')[5];}),
            species:us.map(data.species,function(d){return d.split('/')[5];})
        });

// Build database
var people = [];
function loadPeople(i){
    d3.json("http://swapi.co/api/people/"+i, function(data){
        if (i != 17) { // item 17 seems to be missing
            people.push({id:i,name:data.name,planet:data.homeworld,species:data.species});
        }
        if (i<88) {
            loadPeople(i+1);
        } else {
            finishedPeople = true;
            mergeAllData();
        }
    })
}
loadPeople(1);

var species = [];
function loadSpecies(i){
    d3.json("http://swapi.co/api/species/"+i, function(data){
        species.push({id:i,name:data.name});
        if (i<37) {
            loadSpecies(i+1);
        } else {
            finishedSpecies = true;
            mergeAllData();
        }
    })
}
loadSpecies(1);

var planets = [];
function loadPlanets(i){
    d3.json("http://swapi.co/api/planets/"+i, function(data){
        planets.push({id:i,name:data.name,diameter:data.diameter});
        if (i<61) {
            loadPlanets(i+1);
        } else {
            finishedPlanets = true;
            mergeAllData();
        }
    })
}
loadPlanets(1);

var films = [];
function loadFilms(i){
    d3.json("http://swapi.co/api/films/"+i, function(data){
        films.push({
            id:data.episode_id,
            title:data.title,
            opening_crawl:data.opening_crawl,
            people:us.map(data.characters,function(d){return d.split('/')[5];}),
            planets:us.map(data.planets,function(d){return d.split('/')[5];}),
            species:us.map(data.species,function(d){return d.split('/')[5];})
        });
        if (i<7) {
            loadFilms(i+1);
        } else {
            finishedFilms = true;
            mergeAllData();
        }
    })
}
loadFilms(1);

// merge the whole data and save it
function mergeAllData(){
    if (finishedPeople && finishedSpecies && finishedPlanets && finishedFilms) {
        // merge
        data = {"people":people, "species":species, "planets":planets, "films":films};
        // save (from http://stackoverflow.com/a/2497040/4564295)
        var fs = require('fs');
        fs.writeFile("StarWarsData.json", data, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    }
}


var finishedFilms = false;
var films = [];
function loadFilms(i){
    d3.json("http://swapi.co/api/films/"+i, function(data){
        films.push({
            id:data.episode_id,
            title:data.title,
            opening_crawl:data.opening_crawl,
            people:us.map(data.characters,function(d){return d.split('/')[5];}),
            planets:us.map(data.planets,function(d){return d.split('/')[5];}),
            species:us.map(data.species,function(d){return d.split('/')[5];})
        });
        if (i<7) {
            loadFilms(i+1);
        } else {
            finishedFilms = true;
            mergeAllData();
        }
    })
}
loadFilms(1);
