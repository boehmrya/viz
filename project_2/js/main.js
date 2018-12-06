/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

var margin = { left:100, right:100, top:100, bottom: 200 };

var width = 900 - margin.left - margin.right;
var height = 600 - margin.top - margin.bottom;

var flag = true;

var year = 0;

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


// X Scale - income per capita
var x = d3.scaleLog()
	.domain([300, 150000])
  .range([0, width])
  .base(10);


// Y Scale - life expectancy
var y = d3.scaleLinear()
	.domain([0, 90])
  .range([height, 0]);


// Color Scale for continents
var color = d3.scaleOrdinal()
  .domain(["africa","n. america","europe",
          "s. america", "asia", "australasia"])
  .range(["red", "orange", "yellow", "green",
          "blue", "indigo", "grey"]);


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


// Bind data
d3.json("data/data.json").then(function(data){
  dataset = data[year]['countries'];


  // filter out null values from the array of countries for the selected year.
  dataset = dataset.filter(function (el) {
    return el.country != null && el.income != null && el.population != null;
  });


	console.log(dataset);


  // X Axis
  var xAxisCall = d3.axisBottom(x)
    .tickValues([400, 4000, 40000])
    .tickFormat( function(d) { return "$" + d; });
  xAxisGroup.transition(t).call(xAxisCall);


  // Y Axis
  var yAxisCall = d3.axisLeft(y)
    .tickFormat( function(d) { return d; });
  yAxisGroup.transition(t).call(yAxisCall);

  // Size of circle
  var size = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d.population; })])
    .range([5, 25]);


  // bind data to circles for the selected year.
  g.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
      .attr("fill", function(d) { return color(d.continent)})
      .attr("cy", function(d) { return y(d.life_exp) })
      .attr("cx", function(d) { return x(d.income / d.population) })
      .attr("r", function(d) { return (Math.PI * Math.pow(size(d.population), 2)) });

  /*
  d3.interval( function() {
    update(data);
    year += 1;
  }, 100);
  */

  // run the vis for the first time
  //update(data);
});


function update(data) {
  // remove any country-year combos that have a null value for life expectancy, income, or population


  // X Axis


  // Y Axis


  // JOIN new data with old elements


  // EXIT old elements not present in new data.


  // ENTER new elements present in new data.

}
