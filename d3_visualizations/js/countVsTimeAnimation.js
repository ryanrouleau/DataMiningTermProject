var countMatrixLoaded = false;
var centersLoaded = false;
var countMatrixDic = [];
var centersDic = [];
d3.csv("./countMatrix.csv", function(data) {
    countMatrixDic = data;
    countMatrixLoaded = true;
    runAnimation()
});
d3.csv("./centers.csv", function(data) {
    centersDic = data;
    centersLoaded = true;
    runAnimation()
});

function runAnimation() {

    // dealing with async loading of csv
    if (!countMatrixLoaded || ! centersLoaded) {
        return;
    }

    var countMatrix = []
    var centers = []
    for (i = 1; i < countMatrixDic.length; i++) {
        arr = []
        for (j = 0; j < 8; j++) {
            arr.push(countMatrixDic[i][j]);
        }
        countMatrix.push(arr);
        //countMatrix.append([for (key of countMatrixDic[i].items() [key, countMatrixDic[i][key]])])
    }
    for (i = 0; i < centersDic.length; i++) {
        centers.push([parseFloat(centersDic[i]['lat']), parseFloat(centersDic[i]['long'])]);
    }

    console.log(centers);
    //console.log(data[0])


    var margin = {top: 20, right: 15, bottom: 60, left: 60}
    var width = 800 - margin.left - margin.right
    var height = 800 - margin.top - margin.bottom;
    // width,height 726px
    // 0.35 total lat/long in graph
    // 2,074.29px per 1 lat/long
    // so radius scaled is 2,074.28*0.07956066 = 165px
    var x = d3.scaleLinear()
              .domain([-88, -87.45])
              .range([ 0, width ]);

    var y = d3.scaleLinear()
              .domain([41.55, 42.1])
              .range([ height, 0 ]);

    var chart = d3.select('.chart');
    console.log(chart)
    /*.append('svg:svg')
    .attr('width', width + margin.right + margin.left)
    .attr('height', height + margin.top + margin.bottom)
    .attr('class', 'chart')*/

    var main = chart.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('width', width)
        .attr('height', height)
        .attr('class', 'main');

    // draw the x axis
    var xAxis = d3.axisBottom()
        .scale(x);

    main.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'main axis date')
        .call(xAxis);

    // draw the y axis
    var yAxis = d3.axisLeft()
        .scale(y);

    main.append('g')
        .attr('transform', 'translate(0,0)')
        .attr('class', 'main axis date')
        .call(yAxis);

    /*
    var heatmapColor = d3.scaleQuantize()
        .domain([0,1000])
        .range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
        "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
*/
    var heatmapColor = d3.scaleLinear()
      .domain([0, 1000])
      //.range(["#0900F6", "F5000A"]);
      .range(["#6363FF",  "#FF6364"]);

    var g = main.append("svg:g");

    console.log('!!!');
    console.log("test");

    for (k = 0; k < centers.length; k++) {
        centers[k][2] = countMatrix[j][k];
    }
    /*centers.sort(sortFunc);
    function sortFunc(a, b) {
        if (a[2] === b[2]) {
            return  0;
        }
        else {
            return (a[2] < b[2]) ? -1 : 1;
        }
    }*/

    console.log(centers);

    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var year = 2001;
    //countMatrix.reverse();
    var monthI = 1;
    var monthEl = document.getElementById("month");
    var yearEl = document.getElementById("year");
    for (j = 0; j < countMatrix.length; j++) {
        (function (j) {
            setTimeout(function () {
                month = months[monthI % 12];
                if (monthI % 12 == 0) {
                    year++;
                }
                monthI++;
                monthEl.textContent = month;
                yearEl.textContent = year;
                d3.selectAll("circle")
                    .remove();
                console.log(j);
                var data = centers;
                for (k = 0; k < centers.length; k++) {
                    data[k][2] = countMatrix[j][k];
                }
                console.log(data)

                g.selectAll("scatter-dots")
                    .data(data)
                    .enter().append("svg:circle")
                    .attr("cx", function (d,i) { return x(d[0]); } )
                    .attr("cy", function (d) { return y(d[1]); } )
                    .attr("r", 105)
                    .style("fill", function(d) {
                        return heatmapColor(d[2])
                    });
            }, 50*j)
        })(j);
    }
}
