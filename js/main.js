
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
        temp += `<option value='${element.id}'> ${element.name} </option>`;
    });
    id.append(temp);
}

for (var i = 0; i < urls.length; i++) {
    populateFilters(urls[i].url, urls[i].id);
}