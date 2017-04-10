/*
    Description: Contains code for Star Wars Dashboard
    Version: 0.1
    Author: Parwinder Bhagat
 */

// Declare global constants and variables here
//==============================================

// TODO: provide labelString and title as input
const graphOption = {
    scales: {
        yAxes: [{
            ticks: {
                max: 540,
                min: 460,
                stepSize: 10
            },
            scaleLabel: {
                display: true,
                labelString: 'Crawl Length (Character)'
            }
        }],
        xAxes: [{
            ticks: {
                autoSkip: false,
                maxRotation: 90,
                minRotation: 90
            }
        }]
    },
    title: {
        display: true,
        text: 'Opening Crawl Length Graph'
    },
    legend: {
        display: false
    }
}

//TODO: Remove backgroundColor or allow user to provide as input
const graphData = {
    labels: [],
    datasets: [
        {
            backgroundColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(76, 159, 64, 1)'
            ],
            data: [],
        }
    ]
};

// Core functionality
//==============================================

var constructGraph = function(labels, scrollLength, graphData){
    var currentGraphData = graphData;

    // Create local occurence of graphData. Do not modify global graphData
    currentGraphData.labels = labels,
    currentGraphData.datasets[0].data = scrollLength;

    var ctx = document.getElementById("scroll-chart");
    new Chart(ctx, {
        type: "bar",
        data: currentGraphData,
        options: graphOption
    });
    
};

var createCardDeck = function(){

};

var prepData = function(data){
    var results = data,
        labels = [],
        scrollLength = [];
    results.sort(function(a, b) {
        return a.episode_id - b.episode_id;
    });
    for (let i = 0; i< results.length; i++){
        labels.push(results[i].title);
        scrollLength.push(results[i].opening_crawl.length);
    }
    constructGraph(labels, scrollLength, graphData);
}

// Trigger on document ready
//==============================================

$(document).ready(function(){
    $.ajax({
        type: "GET",
        url: "http://swapi.co/api/films/",
        success: function (response) {
            prepData(response.results);
        }
    });
});