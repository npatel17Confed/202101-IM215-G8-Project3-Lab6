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
}

// filter the table based on events
const filterTable = (data) => {
    var filterList = {};
    const keys = {'filterCountry': 'country_code', 'filterBrowser': 'browser_id', 'filterOS': 'os_id'};
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
    });
}