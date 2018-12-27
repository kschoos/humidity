$( document ).ready(function() {
    console.log( "ready!" );
    // var ctx = document.getElementById("myChart").getContext('2d');
    $.getJSON(url, function(data){
        console.log(data);
        var ctx_long = $("#canv_long")[0].getContext('2d');
        var ctx_short = $("#canv_short")[0].getContext('2d');

        dataset_long = getLabelsAndValuesFromDataset(10, data['long']);
        dataset_short = getLabelsAndValuesFromDataset(1, data['short']);

        var myLongChart = new Chart(ctx_long, {
            type: 'line',
            data: {
                labels: dataset_long['labels'],
                datasets: [{
                    label: 'Short-term Humidity Sensor Values',
                    data: dataset_long['values'],
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });

        var myShortChart  = new Chart(ctx_short, {
            type: 'line',
            data: {
                labels: dataset_short['labels'],
                datasets: [{
                    label: 'Long-term Humidity Sensor Values',
                    data: dataset_short['values'],
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
    });
});

function getLabelsAndValuesFromDataset(average_window, data)
{
    labels = data.filter((element) => element["action"] == "read")
        .map(element => (new Date(parseInt(element["time"]) * 1000)).toISOString().substr(11, 8));
    values = data.filter((element) => element["action"] == "read")
        .map(element => element["value"]);

    values = values.filter((element, index) => index < values.length - values.length % average_window);
    labels = labels.filter((element, index) => index < labels.length - labels.length % average_window);

    values = values.reduce((prevValue, element, index) => {index % average_window == 0 ? (prevValue.push(parseInt(element)/average_window)) : (prevValue[prevValue.length - 1] += 1/average_window * parseInt(element)); return prevValue}, []);
    labels = labels.reduce((prevValue, element, index) => {(index % average_window == 0 ? (prevValue.push(element)) : 0); return prevValue }, []);

    return {values: values, labels: labels};
}
