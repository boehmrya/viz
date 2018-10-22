/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var margin = { left:100, right:10, top:10, bottom:150 };

var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var flag = true;

var t = d3.transition().duration(750);

var g = d3.select("#chart-area").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + ","
        + margin.top + ")");


var xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0, " + height + ")");


var yAxisGroup = g.append("g")
  .attr("class", "y-axis");


// X Scale
var x = d3.scaleLog()
	.domain([300, 150000])
  .range([0,width])
  .base(10);


// Y Scale
var y = d3.scaleLinear()
	.domain([0, 90])
  .range([height,0]);


// X Label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", width / 2)
  .attr("y", height + 80)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)");

// Y Label
var yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(height / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Life Expectancy (Years)");

d3.json("data/data.json").then(function(data){
	console.log(data);

  d3.interval( function() {
    update(data);
  }, 100);

  // run the vis for the first time
  update(data);
});


function update(data) {
  // X Axis
  var xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);

  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .tickFormat( function(d) { return "$" + d; });
  yAxisGroup.transition(t).call(yAxisCall);

  // JOIN new data with old elements
  var circles = g.selectAll("circle")
    .data(data, function(d) {
      return d.month;
    });

  // EXIT old elements not present in new data.
  circles.exit()
    .attr("fill", "red")
  .transition(t)
    .attr("cy", y(0))
    .remove();


  // ENTER new elements present in new data.
  circles.enter()
    .append("circle")
      .attr("fill", "grey")
      .attr("cy", y(0))
      .attr("cx", function(d) { return x(d.month) + x.bandwidth() / 2 })
      .attr("r", 5)
      // AND UPDATE old elements present in new data.
      .merge(circles)
      .transition(t)
        .attr("cx", function(d) { return x(d.month)  + x.bandwidth() / 2 })
        .attr("cy", function(d) { return y(d[value]); })

  var label = flag ? "Revenue" : "Profit";
  yLabel.text(label);
}
