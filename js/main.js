
$.get('http://randyconnolly.com/funwebdev/services/visits/browsers.php').done(function(data){
    printData(data);
})

function printData(data){
    var temp ='';
    data.forEach(element => {
        temp += `<option value='${element.id}'> ${element.name} </option>`; 
    });
    $('#filterBrowser').append(temp);
}