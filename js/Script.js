// Load data from a json file hosted in my github account
d3.json('http://raw.githubusercontent.com/chumo/Star_Wars/gh-pages/data/EpisodesData.json',loadEpisodes);

function loadEpisodes(jsonData){

    // Append image posters
    var posters = d3.select("#posters");

    posters.selectAll(".poster")
        .data(jsonData)
        .enter()
        .append("img")
        .attr("class","poster")
        .attr("src",function(d,i){return "img/poster"+(i+1)+".jpg";})
        .on("click",updateViz);

    // The planets will be colored according to their population density in logarithmic scale
    var planets = _.flatten(_.map(jsonData,function(d){return d.planets;}));
    var populations = _.map(planets,function(d){return d.population;});
    var surfaceAreas = _.map(planets,function(d){return Math.PI*Math.pow(d.diameter,2);});
    var popuDensities = _.map(planets,function(d,i){return populations[i]/surfaceAreas[i];});

    var maxPopuDensity = _.max(popuDensities);
    var minPopuDensity = _.min(popuDensities);
    popuScale = d3.scale.log()
                    .domain([minPopuDensity,maxPopuDensity])
                    .range(["white","blue"]);

}

// Update visualization when a poster is clicked
function updateViz(episode){
    // text below posters
    d3.select("#selectedMovie").text(episode.title);
    d3.select("#openingCrawl").text(episode.opening_crawl);

    // remove previous layout
    var mySVG = d3.select("#mySVG");
    mySVG.selectAll("*").remove();

    // header of list of characters for every planet
    var listTitle = mySVG.append("text")
        .attr("x",10)
        .attr("y",30)
        .style("font-weight","bold")
        .text("Hover over a planet");

    // the planets will be the nodes
    var planets = episode.planets;
    // _.map(planets,function(d){
    //     d.x = 500 + Math.random()*200 - 100;
    //     d.y = 400 + Math.random()*200 - 100;
    // })

    // define force layout
    var force = d3.layout.force()
        .nodes(planets)
        // .links([])
        .size([1000, 800])
        .charge(-300);

    // attach svg elements to every node
    var nodeGroups = mySVG.selectAll("g")
                        .data(planets)
                        .enter().append("g");

    nodeGroups // circles
        .append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",function(d){return 0.005*d.diameter/2;})
        .style("fill", function(d){return popuScale(d.population/(Math.PI*Math.pow(d.diameter,2)));})
        .style("stroke", "black")
        .style("stroke-width", "1.5px")
        .call(force.drag)
        .on("mouseenter",showCharacters)
        .on("mouseout",hideCharacters);

    nodeGroups // planet names
        .append("text")
        .style("text-anchor","middle")
        .attr("y",function(d){return -3-0.005*d.diameter/2;})
        .text(function(d){return d.name});

    function showCharacters(planet){ // show character names
        // change circle color
        d3.select(this)
            .transition()
            .style("fill","red");

        // change list title
        listTitle.text("Characters coming from "+planet.name+":");

        // Populate list with character names
        var characters = planet.people;
        // bind
        var listCharacters = mySVG
                        .selectAll(".character")
                        .data(characters);

        // update
        listCharacters
            .attr("x",10)
            .attr("y",function(d,i){return 60+20*i;})
            .text(function(d){return "- "+d.name+" ("+d.species+")";})

        // enter
        listCharacters
            .enter().append("text").attr("class","character")
            .attr("x",10)
            .attr("y",function(d,i){return 60+20*i;})
            .text(function(d){return "- "+d.name+" ("+d.species+")";});

        // exit
        listCharacters
            .exit()
            .remove();
    }

    function hideCharacters(planet){ // change back circle color
        d3.select(this)
            .transition()
            .style("fill", popuScale(planet.population/(Math.PI*Math.pow(planet.diameter,2))));
    }

    // define layout behaviour
    force.on("tick", function() {
        nodeGroups
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        });

    // restart the layout.
    force.start();

}
