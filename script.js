/*
    Description: Contains code for Star Wars Dashboard
    Version: 0.2
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
    datasets: [{
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
    }]
};

// Core functionality
//==============================================

var constructGraph = function (labels, scrollLength, graphData) {
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

var getCastNames = function (films) {
    var castByFilm = [];
    for (let i = 0; i < films.length; i++) {
        castByFilm.push([]);
    }
    var promise = $.ajax({
        type: "GET",
        url: "http://swapi.co/api/people/"
    });
    promise.done(function (response) {
        var castArray = response.results;
        for (let i = 0; i < castArray.length; i++) {
            for (let j = 0; j < castArray[i].films.length; j++) {
                var currentCastFilms = castArray[i].films[j];
                console.log(currentCastFilms.charAt(currentCastFilms.length - 2));
            }
        }
        createCardDeck(films, castArray);
    });
}

var constructTemplate = function (index, value, cast) {
    var render = '<div class="card-number-' + index + '">' +
        '<img class="card-img-top" src="assets/' + index + '.jpg" alt="Poster">' +
        '<span class="card-text"><h4 class="card-title">' + value.title + '</h4>' +
        '<span>Director: ' + value.director + ' </span><br>' +
        '<span>Cast: ' + cast[0].name + '</span></span>' +
        '</div>';
    return render;
};

var createCardDeck = function (films, cast) {
    var template = '';
    var mainArea = document.getElementById('card-holder');
    for (let i = 0; i <= films.length; i += 2) {
        var current = i,
            next = i + 1;
        template += '<div class="card">';
        template += constructTemplate(current, films[current], cast);
        if (films[next]) {
            template += constructTemplate(next, films[next], cast);
        }
        template += '</div>';
    }
    $(mainArea).append(template);

};

var prepData = function (data) {
    var results = data,
        labels = [],
        scrollLength = [];
    results.sort(function (a, b) {
        return a.episode_id - b.episode_id;
    });
    for (let i = 0; i < results.length; i++) {
        labels.push(results[i].title);
        scrollLength.push(results[i].opening_crawl.length);
    }
    constructGraph(labels, scrollLength, graphData);
    getCastNames(results);
}

// Trigger on document ready
//==============================================

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://swapi.co/api/films/",
        success: function (response) {
            prepData(response.results);
        }
    });
});