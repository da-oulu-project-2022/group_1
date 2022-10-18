var BPM = 0.0;
var heart = document.getElementById("heartSprite");
let p = document.getElementById("dataText");
var has_accelerometer_service = false;
var connected_server;
var accelerometer_data;
var services_discovered;
var service_count;

var options = {
    acceptAllDevices: true
}

if (navigator.bluetooth === undefined) {
p.textContent = "Web bluetooth is not supported";
}
else {
let button = document.getElementById("connectButton");
button.style.cursor = "pointer";
handleCharacteristicValueChanged = (event) => {
    heart.hidden = false;
    let value = event.target.value; // a dataviewer object is provided by the object event
    let heartrate = value.getUint8(1); // we select the eight bytes that contain the heartrate informations
    p.textContent = heartrate + " BPM"; // and display it
    BPM = heartrate;
}
onClickEvent = () => {
    navigator.bluetooth.requestDevice({
        filters: [
          {
            manufacturerData: [{ companyIdentifier: 0x006b }] // Filtering devices with company indentifier, showing only devices made by Polar
          }
        ],
        acceptAllDevices: false
    }) 
    .then(device => device.gatt.connect()) // after the user select a device, we return the selected one
    .then(function (server) {
            connected_server = server;
            discoverServicesAndCharacteristics();
    })
    /* server.getPrimaryService('heart_rate')) // we get the service
    .then(service => service.getCharacteristic('heart_rate_measurement')) // then the characteristics
    .then(characteristic => characteristic.startNotifications())
    .then(characteristic => {
        characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged); // then we subscribe to the characteristic notifications
    })                                                                                                    // and set the callback function
    .catch(error => { console.error(error); }); // we display the errors on the console*/
}

function discoverServicesAndCharacteristics() {
    connected_server.getPrimaryServices() // Calling getPrimaryServices method which returns promise array containing all the services the device advertises 
        .then(services => {
            service_count = services.length;
            console.log("Got " + service_count + " services");
            services.forEach(service => {
                console.log(service.uuid);
                console.log(service.getCharacteristics());
            })
/*             services.forEach(service => {
                if (service.uuid == "e95d0753-251d-470a-a062-fa1922dfa9a8") {
                    has_accelerometer_service = true;
                    console.log(has_accelerometer_service);
                } 
                else {
                    console.log("No accelerometer service");
                }
            }) */
        })
}

button.addEventListener('click', onClickEvent);
let startTime = performance.now();
let step = 0;
updateHeartSize = () => {
    if (BPM > 0) {
        let ibi = 60. / BPM * 1000;
        let elapsedTime = performance.now() - startTime;
        let scaleUp = 1.1;
        let scaleDown = (1 / scaleUp).toFixed(2);
        if (elapsedTime < ibi * 0.05 && step == 0) {
            step++;
            heartSprite.style.transform = "scale(" + scaleUp + ")";
        }
        else if (elapsedTime > ibi * 0.05 && elapsedTime < ibi * 0.22 && step == 1) {
            step++;
            heartSprite.style.transform = "scale(" + scaleDown + ")";
        }
        else if (elapsedTime > ibi * 0.22 && elapsedTime < ibi * 0.26 && step == 2) {
            step++;
            heartSprite.style.transform = "scale(" + scaleUp + ")";
        }
        else if (elapsedTime > ibi * 0.26 && step == 3) {
            step++;
            heartSprite.style.transform = "scale(" + scaleDown + ")";
        }
        if (elapsedTime > ibi) {
            step = 0;
            startTime = performance.now();
        }
    }
    globalID = requestAnimationFrame(updateHeartSize);
};
let globalID = requestAnimationFrame(updateHeartSize);
}