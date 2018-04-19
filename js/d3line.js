var files_arr=[];//Global variable for csv file name array
var csv_data=null;//Global variable for each csv file data
var csv_data_arr=[];//Global variable for csv files data array
var div=null;//Global div variable for tooltip div 

function colors_function(){
	
	return	["blue", "green", "red"];
}

$(document).ready(function(e) {

    // width and height settings
    var width = 910;
    var height = 500;
    var margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 50
    };
    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    // colors
    var colorLine = colors_function();
	
	// Defining the tooltip div
	div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
	
    // initializing the SVG
    var svg = d3.select(".placeSvg").append("svg")
        .attr("width", width + margin.left + margin.right + 150)
        .attr("height", height + margin.top + margin.bottom + 150);

    // appending the heading text
    svg.append("g")
        .attr("transform", "translate(" + 550 + "," + (margin.top + 10) + ")")
        .append("text")
        .style("font-size", "30px")
        .attr("text-anchor", "middle")
        .text("Monthly BTC/USD Data - 2017");

    // appending the paragraph text
    svg.append("g")
        .attr("transform", "translate(" + 550 + "," + (margin.top + 30) + ")")
        .append("text")
        .style("font-size", "12px")
        .attr("text-anchor", "middle")
        .text("Khalid el Khuri 11927739");

    // appending the link text
    svg.append("g")
        .attr("transform", "translate(" + (width - 80) + "," + (margin.top +
            height + 150) + ")")
        .append("text")
        .style("font-size", "10px")
        .attr("text-anchor", "middle")
        .text("Source: investing.com/currencies/btc-usd-historical-data");

    // initializing the main group g
    svg = svg.append("g")
        .attr("class", "main_group")
        .attr("transform", "translate(-800,-150) scale(2.0)");


	//----------------------Initializing the Map--------------------
	var load_map=d3.select(".main_group").selectAll("path.mapChart")
	.data(map)
	.enter();
	
	load_map.append("path")
	.attr("class",function(d,i){return "map area-"+i+" "+d.title.replace(/ /g,"_").toLowerCase();})
	.style("-ms-transform","scale(0)")
	.style("-webkit-transform","scale(0)")
	.style("transform","scale(0)")
	.attr("d",function(d){return d.d;})
	.attr("fill",function(d,i){return "#ddd";})
	.transition()
	.duration(150)
	.delay(function(d,i){return i*10;})
	
	.style("-ms-transform","scale(1)")
	.style("-webkit-transform","scale(1)")
	.style("transform","scale(1)");
	
	load_map.exit().remove();
	
	//--------------------------
	
	//-----------Line between the map and pie chart------------
	
	d3.select("svg").append("line")
	.attr("x1",function(){return (width/2)+175;})
	.attr("x2",function(){return (width/2)+175;})
	.attr("y1",110)
	.attr("y2",function(){return height+80;})
	.attr("stroke","#ccc");
	
	//-----------
	

	//Files name and using queue function for reading the all files once
	var files = ["2012.csv" ,"2013.csv", "2014.csv", "2015.csv", "2016.csv" ];
	var queue = d3.queue();	
	files.forEach(function(filename) {
	  queue.defer(d3.csv, "data/"+filename);
	});
	
	queue.awaitAll(function(error, csvData) {
	  if (error) throw error;
	  
	   //csvData set array
		csv_data_arr=csvData;
		
				 
		files_arr=files; 
		//--------------- appending the Years selectors on the top
		var selector = d3.select("body").append("select")
			.attr("id", "selector")
			.attr("class","form-control")
			.on("change", function(d, i) {
				return pick_year();
			});
	
		// appending the options with year
		selector.selectAll("option")
			.data(files)
			.enter().append("option")
			.attr("value", function(d, i) {
				return i;
			})
			.text(function(d) {
				return d;
			});
	 	//-----------------------
		
		data=csv_data=csvData[0];
		
		//Getting the Min and Max value of crime index
		var max_crime_index = d3.max(data, function(d) { return +d['Crime Index'];} );
		var min_crime_index = d3.min(data, function(d) { return +d['Crime Index'];} );
		
		//Sorting in ascending order crime index wise
		data.sort(function(a,b) {return (a['Crime Index'] > b['Crime Index']) ? 1 : ((b['Crime Index'] > a['Crime Index']) ? -1 : 0);} ); 
		
	
		//------------Loading the colors Range------------
		var colors = d3.scaleQuantize()
			.domain([min_crime_index,max_crime_index])
			.range(["#98FB98","#7CFC00","#00FF00","#32CD32","#228B22","#006400","#E9967A","#F08080","#CD5C5C","#DC143C","#B22222","#8B0000"]);
		//----------------
		
		
		//------------Loading the Legends----------					
		var svg = d3.select("svg")
				.append("g")
				.attr("class","legends_g")
				.attr("transform","translate(0,60)");
		
		
		d3.select(".legends_g")
			.selectAll(".text_leg")
			.data([min_crime_index,max_crime_index])
			.enter()
			.append("text")
			.attr("class",function(d,i){return "text_leg "+"txt"+i})
			.text(function(d){return d;});
			
		
		var rects = svg.selectAll(".rects")
			.data(data)
			.enter()
			.append("rect")
			.attr("y", 10)
			.attr("height", 13)
			.attr("x", 0)
			.attr("width", 5)
			.transition()
			.delay(function(d,i){return i*5;})
			.duration(300)
			.attr("x", function(d,i){ 
			
				d3.select(".text_leg.txt1").attr("x",(i*5)+5).attr("text-anchor","end");
			
				return+ i*5;
			 })
			.attr("class",function(d){ return "leg_"+d["Country"].replace(/ /g,"_").toLowerCase();})
			.attr("fill", function(d){return colors(d['Crime Index']);})
			.attr("stroke", "none");
							
		
		//--------------------------
		
					
		//-----------Adding rectangle icon for legend------------
		d3.select("svg").append("path")
		.attr("class","legend_pointer")
		.style("opacity",0)
		.attr("d","M0.10047982011977868,8.509342248556353 L3.9913046123417266,1.1922678619358424 L7.88212940456369,8.509342248556353 L0.10047982011977868,8.509342248556353 z");
		//------------
		
		
		//Mapping the map according to crime index
		data.map(function(d,i){
			
			if($("."+d.Country.replace(/ /g,"_").replace(/\)/g,"").replace(/\(/g,"").toLowerCase()).length>0){
							
				$("."+d.Country.replace(/ /g,"_").toLowerCase()).addClass("active");
				d3.select("."+d.Country.replace(/ /g,"_").toLowerCase())
				.attr("fill",function(){return colors(d['Crime Index']);})
				.on("mouseover",function(){
					$("."+d.Country.replace(/ /g,"_").toLowerCase()).css({"stroke-width": "0.5","stroke": colors(d['Crime Index'])});
					
					 div.transition()		
					.duration(200)		
					.style("opacity", 1);		
					div.html("<div class='countryDiv'>"+d.Country+"</div>"+"<b>Crime Index: </b>"  + d['Crime Index'])	
					.style("left", (d3.event.pageX-50) + "px")		
					.style("top", (d3.event.pageY - 50) + "px");	
					
					var x=$(".leg_"+d.Country.replace(/ /g,"_").toLowerCase()).attr("x");	
					
					
					d3.select(".legend_pointer").attr("transform","translate("+x+","+83+")");
					d3.select(".legend_pointer").style("opacity",1);
				})
				.on("mouseout",function(){
					$("."+d.Country.replace(/ /g,"_").toLowerCase()).css({"stroke-width": "0"});
					
					 div.transition()		
					.duration(200)		
					.style("opacity", 0);
					d3.select(".legend_pointer").style("opacity",0);
					
				})
				.on("mousemove",function(){
					
					div.html("<div class='countryDiv'>"+d.Country+"</div>"+"<b>Crime Index: </b>"  + d['Crime Index'])	
					.style("left", (d3.event.pageX-50) + "px")		
					.style("top", (d3.event.pageY - 50) + "px");
				})
				.on("click",function(){
					
					//Draw the pie chart for clicked country
					draw_pie_chart(d);
				});
				
			}
		});
		
		//Draw Pie chart of country
		setTimeout(function(){draw_pie_chart(data[data.length-1]);},100);
		
		
	});	
});

//For making it dynamic for multiple years data
function pick_year(){
	
	// getting the data for selected year
    var i = d3.select("#selector").property("value");
	
	data=csv_data=csv_data_arr[i];
	
	//Getting the min and max value of crime index
	var max_crime_index = d3.max(data, function(d) { return +d['Crime Index'];} );
	var min_crime_index = d3.min(data, function(d) { return +d['Crime Index'];} );
	
	//Sorting in ascending order crime index wise
	data.sort(function(a,b) {return (a['Crime Index'] > b['Crime Index']) ? 1 : ((b['Crime Index'] > a['Crime Index']) ? -1 : 0);} ); 
	
	
	//Remove the previous legend rect line
	$(".legends_g").remove();
	
	//Removing the old pie chart
	$(".pieChart").remove();
	
	//------------Loading the colors Range------------
	
	var colors = d3.scaleQuantize()
		.domain([min_crime_index,max_crime_index])
		.range(["#98FB98","#7CFC00","#00FF00","#32CD32","#228B22","#006400","#E9967A","#F08080","#CD5C5C","#DC143C","#B22222","#8B0000"]);
		
	//-----------
	
	//-----------Add new legend line--------------		
	var svg = d3.select("svg")
			.append("g")
			.attr("class","legends_g")
			.attr("transform","translate(0,60)");
	
	d3.select(".legends_g")
		.selectAll(".text_leg")
		.data([min_crime_index,max_crime_index])
		.enter()
		.append("text")
		.attr("class",function(d,i){return "text_leg "+"txt"+i})
		.text(function(d){return d;});
		
	
	var rects = svg.selectAll(".rects")
		.data(data)
		.enter()
		.append("rect")
		.attr("y", 10)
		.attr("height", 13)
		.attr("x", 0)
		.attr("width", 5)
		.transition()
		.delay(function(d,i){return i*5;})
		.duration(300)
		.attr("x", function(d,i){ 
		
			d3.select(".text_leg.txt1").attr("x",(i*5)+5).attr("text-anchor","end");
		
			return+ i*5;
		 })
		.attr("class",function(d){ return "leg_"+d["Country"].replace(/ /g,"_").toLowerCase();})
		.attr("fill", function(d){return colors(d['Crime Index']);})
		.attr("stroke", "none");
	
	//--------------------------
	
	
	
	//----------------Unlinking the mouse event functions from map due to new data
	d3.selectAll(".map")
	.attr("fill","#ddd")
	.on("mouseout",null)
	.on("mouseover",null)
	.on("mousemove",null);
	$(".map").removeClass("active");
	//-------------
	
	
	
	//--------------Mapping the map according to crime index
	data.map(function(d,i){
						
		if($("."+d.Country.replace(/ /g,"_").replace(/\)/g,"").replace(/\(/g,"").toLowerCase()).length>0){
						
			$("."+d.Country.replace(/ /g,"_").toLowerCase()).addClass("active");
			d3.select("."+d.Country.replace(/ /g,"_").toLowerCase())
			.attr("fill","#ddd")
			.on("mouseover",function(){
				$("."+d.Country.replace(/ /g,"_").toLowerCase()).css({"stroke-width": "0.5","stroke": colors(d['Crime Index'])});
				
				 div.transition()		
				.duration(200)		
				.style("opacity", 1);		
				div.html("<div class='countryDiv'>"+d.Country+"</div>"+"<b>Crime Index: </b>"  + d['Crime Index'])	
				.style("left", (d3.event.pageX-50) + "px")		
				.style("top", (d3.event.pageY - 50) + "px");	
				
				var x=$(".leg_"+d.Country.replace(/ /g,"_").toLowerCase()).attr("x");	
				
				
				d3.select(".legend_pointer").attr("transform","translate("+x+","+83+")");
				d3.select(".legend_pointer").style("opacity",1);
			})
			.on("mouseout",function(){
				$("."+d.Country.replace(/ /g,"_").toLowerCase()).css({"stroke-width": "0"});
				
				 div.transition()		
				.duration(200)		
				.style("opacity", 0);
				d3.select(".legend_pointer").style("opacity",0);
				
			})
			.on("mousemove",function(){
				
				div.html("<div class='countryDiv'>"+d.Country+"</div>"+"<b>Crime Index: </b>"  + d['Crime Index'])	
				.style("left", (d3.event.pageX-50) + "px")		
				.style("top", (d3.event.pageY - 50) + "px");
			})
			.on("click",function(){
				
				draw_pie_chart(d);
			})
			.transition()	
			.delay(function(d,i){return i*100;})	
			.duration(300)
			.attr("fill",function(){return colors(d['Crime Index']);});
			
		}
		
	});
	
	//Draw Pie chart of country
	setTimeout(function(){draw_pie_chart(data[data.length-1]);},100);
	

}


//For drawing the pie chart
function draw_pie_chart(d){

	//Removing the old pie chart
	$(".pieChart").remove();
	
	var radius = 150;
	
	var svg = d3.select("svg");
	
	g = svg.append("g").attr("class","pieChart").attr("transform", "translate(800,330)");
	
	//var color = d3.scaleOrdinal(d3.schemeCategory20);;
	var color = d3.scaleOrdinal(['#2ecc71','#3498db','#e74c3c','#99e63b','#f5ae1d','#e9967a']);
	
	//Pie chart functions
	var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.value; });
	var path = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);
	var label = d3.arc()
		.outerRadius(radius - 40)
		.innerRadius(radius - 40);
	
	var data=[];
	
	var countryName="";
	
	//Seperating the keys and values of selected country
	for(key in d){
		
		if(key.toLowerCase()!="country"){
			data.push({'key_val':d[key],'value':d[key],'key':key});
		}
		
		else{
			countryName=d[key];
		}
	}
	
	
	g.append("text")
	.text(countryName)
	.style("font-size","24px")
	.attr("y","-165")
	.attr("text-anchor","middle");
	
	 //Transition function
	 function arcTween(a) {
		  var i = d3.interpolate(this._current, a);
		  this._current = i(0);
		  return function(t) {
			return arc(i(t));
		  };
	  }
	 
	  //Making the paths for pie chart
	  var arc = g.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		  .attr("class", "arc");
	  arc.append("path")
		  .attr("fill", function(d) { return color(d.data.key_val); })
		  .on("mouseover",function(d){
			  
			   div.transition()		
			  .duration(200)		
			  .style("opacity", 1);		
			  div.html("<div class='countryDiv'>"+d.data.key+"</div>" + d.data.value)		
			  .style("left", (d3.event.pageX-50) + "px")		
			  .style("top", (d3.event.pageY - 50) + "px");	
			  
		  })
		  .on("mouseout",function(){
			  
			   div.transition()		
			  .duration(200)		
			  .style("opacity", 0);
			  
		  })
		  .on("mousemove",function(d){
			  
			   div.html("<div class='countryDiv'>"+d.data.key+"</div>" + d.data.value)	
			  .style("left", (d3.event.pageX-50) + "px")		
			  .style("top", (d3.event.pageY - 50) + "px");	
		  })
		  .transition()
		  .delay(function(d,i){return 5*i;})
		  .duration(50)
		  .attrTween('d', function(d) {
			   var i = d3.interpolate(d.startAngle+0, d.endAngle);
			   return function(t) {
				   d.endAngle = i(t);
				   return path(d);
			   }
	  	  })
      	  .each(function(d) { this._current = d; });
	  
	  //Adding the text inside of pie chart each section
	  arc.append("text")
	  	.on("mouseover",function(d){
			  
			  $(this).prev("path").css({"-webkit-transform":"scale(1.1)"},{"transform":"scale(1.1)"});
			  
			   div.transition()		
			  .duration(200)		
			  .style("opacity", 1);		
			   div.html("<div class='countryDiv'>"+d.data.key+"</div>" + d.data.value)		
			  .style("left", (d3.event.pageX-50) + "px")		
			  .style("top", (d3.event.pageY - 50) + "px");	
			  
		  })
		  .on("mouseout",function(){
			  
			  $(this).prev("path").css({"-webkit-transform":"scale(1)"},{"transform":"scale(1)"});
			  
			   div.transition()		
			  .duration(200)		
			  .style("opacity", 0);
			  
		  })
		  .on("mousemove",function(d){
			  
			   div.html("<div class='countryDiv'>"+d.data.key+"</div>" + d.data.value)	
			  .style("left", (d3.event.pageX-50) + "px")		
			  .style("top", (d3.event.pageY - 50) + "px");	
		  })
		  .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		  .attr("dy", "0.35em")
		  .attr("text-anchor","middle")
		  .text(function(d) { return d.data.key_val; });
	

}
