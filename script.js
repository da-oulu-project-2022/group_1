var BPM = 0.0 ;
var heart = document.getElementById("heartSprite") ;
let p = document.getElementById("dataText") ;

if (navigator.bluetooth === undefined) {
    p.textContent = "Web bluetooth is not supported" ;
}
else {
    let button = document.getElementById("connectButton") ;
    button.style.cursor = "pointer" ;
    handleCharacteristicValueChanged = (event) => {
        heart.hidden = false;
        let value = event.target.value ; // a dataviewer object is provided by the object event
        let heartrate = value.getUint8(1) ; // we select the eight bytes that contain the heartrate informations
        p.textContent = heartrate + " BPM" ; // and display it
        BPM = heartrate ;
    }
    onClickEvent = () => {
        navigator.bluetooth.requestDevice({ filters: [{ services: ['heart_rate'] }] }) // we filter the devices, displaying only those with heartrate services
            .then(device => device.gatt.connect()) // after the user select a device, we return the selected one
            .then(server => server.getPrimaryService('heart_rate')) // we get the service
            .then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
            .then(characteristic => characteristic.startNotifications())
            .then(characteristic => {
                characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged) ; // then we subscribe to the characteristic notifications
            })                                                                                                    // and set the callback function
            .catch(error => { console.error(error); }) ; // we display the errors on the console
    }
    button.addEventListener('click', onClickEvent ) ;
    let startTime = performance.now() ;
    let step = 0 ;
    updateHeartSize = () => {
        if (BPM > 0)
        {
            let ibi = 60./BPM * 1000 ;
            let elapsedTime = performance.now() - startTime ;
            let scaleUp = 1.1 ;
            let scaleDown = (1/scaleUp).toFixed(2) ;
            if (elapsedTime < ibi * 0.05 && step == 0 )
            {
                step++ ;
                heartSprite.style.transform = "scale(" + scaleUp + ")" ;
            }
            else if ( elapsedTime > ibi * 0.05 && elapsedTime < ibi * 0.22 && step == 1)
            {
                step++ ;
                heartSprite.style.transform = "scale(" + scaleDown + ")" ;
            }
            else if ( elapsedTime > ibi * 0.22 && elapsedTime < ibi * 0.26 && step == 2)
            {
                step++ ;
                heartSprite.style.transform = "scale(" + scaleUp + ")" ;
            }
            else if (elapsedTime > ibi * 0.26 && step == 3)
            {
                step++ ;
                heartSprite.style.transform = "scale(" + scaleDown + ")" ;
            }
            if (elapsedTime > ibi)
            {
                step = 0 ;
                startTime = performance.now() ;
            }
        }
        globalID = requestAnimationFrame(updateHeartSize) ;
    } ;
    let globalID = requestAnimationFrame(updateHeartSize) ;
}

function currentTime() {
    let date = new Date(); 
    let hh = date.getHours();
    let mm = date.getMinutes();
    //let ss = date.getSeconds();
    let session = "AM";
  
      
    if(hh > 12){
        session = "PM";
     }
  
     hh = (hh < 10) ? "0" + hh : hh;
     mm = (mm < 10) ? "0" + mm : mm;
    // ss = (ss < 10) ? "0" + ss : ss;
      
     let time = hh + ":" + mm + " " + session;
  
    document.getElementById("clock").innerText = time; 
    let t = setTimeout(function(){ currentTime() }, 1000); 
  
  }
  
  currentTime();


// load current chart package
google.charts.load("current", {
    packages: ["corechart", "line"]
    });
// set callback function when api loaded
google.charts.setOnLoadCallback(drawChart);


function drawChart() {
    // create data object with default value
    var data = google.visualization.arrayToDataTable([
    ['Time', 'CPU Usage', 'RAM'],
    [0, 0, 0],
    ]);
    // create options object with titles, colors, etc.
    var options = {
    title: "CPU Usage",
    hAxis: {
        textPosition: 'none',
    },
    vAxis: {
        title: "Usage"
    }
    };
    // draw chart on load
    var chart = new google.visualization.LineChart(
    document.getElementById("chart_div")
    );
    chart.draw(data, options);
}