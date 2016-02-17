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

    // the planets will be the nodes
    var planets = episode.planets;

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

    nodeGroups
        .append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",function(d){return 0.005*d.diameter/2;})
        .style("fill", function(d){return popuScale(d.population/(Math.PI*Math.pow(d.diameter,2)));})
        .style("stroke", "black")
        .style("stroke-width", "1.5px")
        .call(force.drag);

    nodeGroups
        .append("text")
        .style("text-anchor","middle")
        .attr("y",function(d){return -3-0.005*d.diameter/2;})
        .text(function(d){return d.name});

    // define layout behaviour
    force.on("tick", function(e) {
        mySVG.selectAll("g")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        });

    // restart the layout.
    force.start();

}
