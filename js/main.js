// populating the filter lists
urls = [
    {
        url: 'http://randyconnolly.com/funwebdev/services/visits/browsers.php',
        id: $('#filterBrowser')
    },
    {
        url: 'http://randyconnolly.com/funwebdev/services/visits/os.php',
        id: $('#filterOS')
    },
    {
        url: 'http://randyconnolly.com/funwebdev/services/visits/countries.php?continent=EU',
        id: $('#filterCountry')
    }
]
function populateFilters(url, id) {
    return $.get(url).done(data => {
        printData(data, id);
    });
}

function printData(data, id) {
    var temp = '';
    data.forEach(element => {
        temp += `<option value='${element.id || element.iso}'> ${element.name} </option>`;
    });
    id.append(temp);
}

for (var i = 0; i < urls.length; i++) {
    populateFilters(urls[i].url, urls[i].id);
}

// populating the table
$.get('http://randyconnolly.com/funwebdev/services/visits/visits.php?continent=EU&month=1&limit=100').done(data => {
    populateTable(data);
    filterTable(data);
});

function populateTable(data) {
    var html = ``;
    data.forEach(el => {
        html += `<tr><td>${el.id}</td><td>${el.visit_date}</td><td>${el.country}</td><td>${el.browser}</td><td>${el.operatingSystem}</td></tr>`;
    });
    $('#visitsBody').html(html);
    $('#piechart').html(displayPie(data));
    $('#columnchart').html(displayBar(data));
    $('#geochart').html(displayGeo(data));
}

// filter the table based on events
const filterTable = (data) => {
    var filterList = {};
    const keys = { 'filterCountry': 'country_code', 'filterBrowser': 'browser_id', 'filterOS': 'os_id' };
    $('#filterCountry,#filterBrowser,#filterOS').on('change', (e) => {
        var key = keys[e.target.id];
        (e.target.value == 0) ? delete filterList[key] : filterList[key] = e.target.value;
        if (Object.keys(filterList).length == 0) populateTable(data);
        var current = $.grep(data, (el, i) => {
            var result = true;
            Object.keys(filterList).forEach(e => {
                if (el[e] !== filterList[e]) {
                    result = false;
                }
            });
            return result;
        });
        populateTable(current);
        $('#piechart').html(displayPie(current));
        $('#columnchart').html(displayBar(current));
        $('#geochart').html(displayGeo(current));
    });
}

function displayPie(data1) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var dict = { "Browser": "Visit Count" };
        data1.forEach(element => {
            dict[element.browser] = (dict[element.browser] || 0) + 1;
        });
        var data = google.visualization.arrayToDataTable(Object.entries(dict));

        var options = {
            title: 'My Browser Count'
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
    }
}

function displayBar(data1) {
    google.charts.load('current', { 'packages': ['bar'] });
    google.charts.setOnLoadCallback(drawStuff);

    var dict = { '': '' };

    data1.forEach(element => {
        dict[element.operatingSystem] = (dict[element.operatingSystem] || 0) + 1;
    });

    function drawStuff() {
        var data = new google.visualization.arrayToDataTable(Object.entries(dict));

        var options = {
            width: 400,
            legend: { position: 'none' },
            bar: { groupWidth: "90%" }
        };

        var chart = new google.charts.Bar(document.getElementById('columnchart'));
        // Convert the Classic options to Material options.
        chart.draw(data, google.charts.Bar.convertOptions(options));
    };
}

function displayGeo(data1) {
    google.charts.load('current', {
        'packages': ['geochart'],
        // Note: you will need to get a mapsApiKey for your project.
        // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
        'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
    });
    google.charts.setOnLoadCallback(drawRegionsMap);

    var dict = { 'Country': 'Visit Count' };

    data1.forEach(element => {
        dict[element.country] = (dict[element.country] || 0) + 1;
    });

    function drawRegionsMap() {
        var data = google.visualization.arrayToDataTable(Object.entries(dict));

        var options = {};

        var chart = new google.visualization.GeoChart(document.getElementById('geochart'));

        chart.draw(data, options);
    }
}