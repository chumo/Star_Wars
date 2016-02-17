// Load data from a json file hosted in my github account
d3.json('http://raw.githubusercontent.com/chumo/Star_Wars/gh-pages/data/EpisodesData.json',loadEpisodes);

function loadEpisodes(json){
    // make data global
    data = json;

    // Append image posters
    var posters = d3.select("#posters");

    posters.selectAll(".poster")
        .data(data)
        .enter()
        .append("img")
        .attr("class","poster")
        .attr("src",function(d,i){return "img/poster"+(i+1)+".jpg";})
        .on("click",updateViz);

}

// Update visualization when a poster is clicked
function updateViz(episode){
    // text below posters
    d3.select("#selectedMovie").text(episode.title);
    d3.select("#openingCrawl").text(episode.opening_crawl);

    // remove previous layout
    var mySVG = d3.select("#mySVG");
    mySVG.selectAll("*").remove();

    // create nodes
    var nodes = _.map(episode.planets, function(d){
        return {radius:0.005*d.diameter/2, name:d.name};
    })

    // define force layout
    var force = d3.layout.force()
        .nodes(nodes)
        // .links([])
        .size([1000, 1000])
        .charge(-300);

    // attach svg elements to every node
    var nodeGroups = mySVG.selectAll("g")
                        .data(nodes)
                        .enter().append("g");

    nodeGroups
        .append("circle")
        .attr("cx",0)
        .attr("cy",0)
        .attr("r",function(d){return d.radius;})
        .style("fill", "steelblue")
        .style("stroke", "black")
        .style("stroke-width", "1.5px")
        .call(force.drag);

    nodeGroups
        .append("text")
        .text(function(d){return d.name});

    // define layout behaviour
    force.on("tick", function(e) {
      mySVG.selectAll("g")
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    });

    // restart the layout.
    force.start();

}
