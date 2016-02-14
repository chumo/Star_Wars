// Build viz

d3.json('http://swapi.co/api/films/',loadFilms);

function loadFilms(data){

    // List of films
    films = _.sortBy(data.results,"episode_id");

    // Build data base
    planets = _.map(films,function(d){d.planets})

    // Append image posters
    var posters = d3.select("#posters");

    posters.selectAll(".poster")
    .data(films)
    .enter()
    .append("img")
    .attr("class","poster")
    .attr("src",function(d){return "img/poster"+d.episode_id+".jpg";})
    .on("click",function(d){
        d3.select("#selectedMovie").text(d.title);
        d3.select("#openingCrawl").text(d.opening_crawl);
        d3.json(d.url,updateSVG);
    });

}

// Update visualization when a poster is clicked
function updateSVG(data){
    // Append menu with film characteristics
    var features = ["characters","planets","starships","vehicles","species"];

    var mySVG = d3.select("#mySVG");

    var circles = mySVG.selectAll("circle").data(features);

    circles
        .transition()
        .attr("cx",function(d,i){return 100 + i*200;})
        .attr("cy",100)
        .attr("r",function(d){return 2*data[d].length;});

    circles
        .enter()
        .append("circle")
        .on("mouseenter",function(){console.log('yep')})
        .transition()
        .attr("cx",function(d,i){return 100 + i*200;})
        .attr("cy",100)
        .attr("r",function(d){return 2*data[d].length;});

    mySVG.selectAll("text")
        .data(features)
        .enter()
        .append("text")
            .attr("x",function(d,i){return 100 + i*200;})
            .attr("y",100)
            .text(function(d){return d});

}
