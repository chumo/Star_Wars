// Load data from a json file hosted in my github account
d3.json('http://raw.githubusercontent.com/chumo/Star_Wars/gh-pages/data/StarWarsData.json',loadFilms);

function loadFilms(json){
    // make data global
    data = json;

    // Append image posters
    var posters = d3.select("#posters");

    posters.selectAll(".poster")
        .data(data.films)
        .enter()
        .append("img")
        .attr("class","poster")
        .attr("src",function(d){return "img/poster"+d.id+".jpg";})
        .on("click",updateViz);

}

// Update visualization when a poster is clicked
function updateViz(film){
    // text below posters
    d3.select("#selectedMovie").text(film.title);
    d3.select("#openingCrawl").text(film.opening_crawl);

    // Update layout
    var mySVG = d3.select("#mySVG");

    var filmPlanets = _.map(film.planets,function(d){return _.findWhere(data.planets,{id:d})});
    var filmPlanetsName = _.map(filmPlanets, function(d){return d.name});
    var filmPlanetsDiameter = _.map(filmPlanets, function(d){return d.diameter});

    var filmPeople = _.map(film.people,function(d){return _.findWhere(data.people,{id:d})});
    var filmPeoplePlanet = _.map(filmPeople,function(d){return d.planet});
    var filmPeoplePlanetObject = _.map(filmPeoplePlanet,function(d){return _.findWhere(data.planets,{id:d})});
    var filmPeoplePlanetName = _.map(filmPeoplePlanetObject,function(d){return d.name;});
    var filmPeoplePlanetDiameter = _.map(filmPeoplePlanetObject,function(d){return d.diameter;});

    // console.log(filmPlanetsName,filmPlanetsDiameter)
    console.log(filmPeoplePlanet,filmPeoplePlanetDiameter)

}
