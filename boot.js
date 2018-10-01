// If user hasn't authed with Fitbit, redirect to Fitbit OAuth Implicit Grant Flow
var fitbitAccessToken;
console.log(fitbitAccessToken);
if (!window.location.hash) {
    window.location.replace('https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=227H22&redirect_uri=https%3A%2F%2F15359f83.ngrok.io%2F&scope=activity%20nutrition%20heartrate%20location%20nutrition%20profile%20settings%20sleep%20social%20weight');
} else {
    var fragmentQueryParameters = {};
    window.location.hash.slice(1).replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { fragmentQueryParameters[$1] = $3; }
    );
    
    console.log(fitbitAccessToken);

    /*fitbitAccessToken = fragmentQueryParameters.access_token;*/
    fitbitAccessToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI2V0dDRkMiLCJhdWQiOiIyMjdHNUwiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJ3aHIgd251dCB3cHJvIHdzbGUgd3dlaSB3c29jIHdzZXQgd2FjdCB3bG9jIiwiZXhwIjoxNTM4NDYwMDE1LCJpYXQiOjE1MzgzNzM2MTV9.iv5Hmg1_2WZWYxpFy1bWcu2hh2hORbIlCdlSnIKvZfo';
    console.log(fitbitAccessToken);
}

// Make an API request and graph it
var processResponse = function(data) {
  console.log(data);
  /*
    if (!res.ok) {
        throw new Error('Fitbit API request failed: ' + res);
    }
 
    var contentType = res.headers.get('content-type')
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return res.json();
    } else {
        throw new Error('JSON expected but received ' + contentType);
    }
  */
}

var processHeartRate = function(timeSeries) {
    return timeSeries['activities-heart-intraday'].dataset.map(
        function(measurement) {
            return [
                measurement.time.split(':').map(
                    function(timeSegment) {
                        return Number.parseInt(timeSegment);
                    }
                ),
                measurement.value
            ];
        }
    );
}

var graphHeartRate = function(timeSeries) {
    console.log(timeSeries);
    var data = new google.visualization.DataTable();
    data.addColumn('timeofday', 'Time of Day');
    data.addColumn('number', 'Heart Rate');

    data.addRows(timeSeries);

    var options = google.charts.Line.convertOptions({
        height: 450
    });

    var chart = new google.charts.Line(document.getElementById('chart'));

    chart.draw(data, options);
}

fetch(
    'https://api.fitbit.com/1/user/-/activities/heart/date/today/1d.json',
    {
        headers: new Headers({
            'Authorization': 'Bearer ' + fitbitAccessToken
        }),
        mode: 'cors',
        method: 'GET'
    }
).then(res => res.json()).then(processResponse)
.then(processHeartRate)
.then(graphHeartRate)
.catch(function(error) {
    console.log(error);
});