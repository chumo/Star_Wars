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
                        .enter().append("g")
                        .on("mouseenter",showCharacters)
                        .on("mouseout",hideCharacters);

    nodeGroups // character names
        .selectAll(".character")
        .data(function(d){return d.people;})
        .enter()
        .append("text")
        .attr("class","character")
        .style("text-anchor","middle")
        .style("font-weight","bold")
        .style("opacity",0)
        .text(function(d){return d.name;});

    nodeGroups // circles
        .append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",function(d){return 0.005*d.diameter/2;})
        .style("fill", function(d){return popuScale(d.population/(Math.PI*Math.pow(d.diameter,2)));})
        .style("stroke", "black")
        .style("stroke-width", "1.5px")
        .call(force.drag);

    nodeGroups // planet names
        .append("text")
        .style("text-anchor","middle")
        .attr("y",function(d){return -3-0.005*d.diameter/2;})
        .text(function(d){return d.name});



    function showCharacters(){ // expand character names
        var characters = d3.select(this).selectAll(".character");
        var numberOfCharacters = characters.data().length;
        //var numberOfCharacters = characters[0].length; // alternative way of retrieving the number of characters in this node
        var radius = 0.005*d3.select(this).data()[0].diameter/2;
        characters
                .style("opacity",1)
                .transition()
		        .attr('x',function(d,i){return (radius+50)*Math.cos(i*2*Math.PI/numberOfCharacters)})
		        .attr('y',function(d,i){return (radius+50)*Math.sin(i*2*Math.PI/numberOfCharacters)});
    }

    function hideCharacters(){ // collapse character names
        var characters = d3.select(this).selectAll(".character");
        characters
                .style("opacity",0)
                .transition()
                .attr('x',0)
                .attr('y',0);
    }

    // define layout behaviour
    force.on("tick", function(e) {
        // console.log(e)
        mySVG.selectAll("g")
            .attr("transform", function(d) {
                // console.log(d)
                return "translate(" + d.x + "," + d.y + ")"; });
        });

    // restart the layout.
    force.start();

}
