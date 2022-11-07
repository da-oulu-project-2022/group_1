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
    console.log("value changed");
    heart.hidden = false;
    let value = event.target.value; // a dataviewer object is provided by the object event
    let heartrate = value.getUint8(1); // we select the eight bytes that contain the heartrate informations
    p.textContent = heartrate + " BPM"; // and display it
    BPM = heartrate;
}

function accHandler(event) {
  let value = event.target.value;
  let acc = value.getUint8(1);
  console.log(acc);
}

let options = {
  filters: [
    {
      manufacturerData: [{ companyIdentifier: 0x006b }] // Filtering devices with company indentifier, showing only devices made by Polar
    },
    {
      services: ["heart_rate"]
    }
  ],
  acceptAllDevices: false,
  optionalServices: [
    "0000180a-0000-1000-8000-00805f9b34fb",
    "0000180f-0000-1000-8000-00805f9b34fb",
    "fb005c80-02e7-f387-1cad-8acd2d8df0c8"
  ]
}

onClickEvent = () => {
    navigator.bluetooth.requestDevice(options) 
    .then(device => device.gatt.connect()) // after the user select a device, we return the selected one
/*     .then(function (server) {
            connected_server = server;
            discoverServicesAndCharacteristics();
    }) */
    .then(server => {
        /* server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb'); */
        return server.getPrimaryServices();
    }) // we get the service
    .then(services => {
        let queue = Promise.resolve();
        services.forEach(service => {
            switch (service.uuid) { 
              case "0000180a-0000-1000-8000-00805f9b34fb":
                queue = queue.then(_ => service.getCharacteristics()).then(characteristics => {
                  deviceInformationService(characteristics);
                })

                break;
              case "0000180f-0000-1000-8000-00805f9b34fb":
                service.getCharacteristic("battery_level")
                .then(characteristic => {
                  return characteristic.readValue();
                })
                .then(value => {
                  let battery_level = value.getUint8(0);
                  console.log("Battery level is " + battery_level + "%")
                })
                break;
/*               case "fb005c80-02e7-f387-1cad-8acd2d8df0c8":
                service.getCharacteristic("fb005c81-02e7-f387-1cad-8acd2d8df0c8")
                .then(characteristic => { 
                  characteristic.writeValueWithResponse(new Uint8Array([0x02, 0x03]));
                })
                .then(_ => {
                  console.log("ACC requested");
                });
                service.getCharacteristic("fb005c82-02e7-f387-1cad-8acd2d8df0c8")
                .then(characteristic => {
                  characteristic.startNotifications()
                  .then(_ => {
                    console.log("notifications started");
                    characteristic.addEventListener("accValueChanged", accHandler);
                  })
                  .catch(error => {
                    console.log("Error: " + error);
                    return;
                  });
                });
                break; */
              case "0000180d-0000-1000-8000-00805f9b34fb":
                service.getCharacteristic("00002a37-0000-1000-8000-00805f9b34fb")
                .then(characteristic => {
                  characteristic.startNotifications()
                  .then(_ => {
                    console.log("notifications started");
                    characteristic.addEventListener("bpmChanged", handleCharacteristicValueChanged);
                  });
                });
                break;
              default:

                break;  
            }
            /* if (service.uuid == "0000180a-0000-1000-8000-00805f9b34fb") {
                queue = queue.then(_ => service.getCharacteristics()).then(characteristics => {
                  deviceInformationService(characteristics);
                })
            } else if (service.uuid == "0000180f-0000-1000-8000-00805f9b34fb") {
                  service.getCharacteristic("battery_level")
                  .then(characteristic => {
                    return characteristic.readValue();
                  })
                  .then(value => {
                    let battery_level = value.getUint8(0);
                    console.log("Battery level is " + battery_level + "%")
                  })

            } */
        })
    })
    .catch(error => {
        console.log('Argh! ' + error);
    });
 //   .then(service => service.getCharacteristic('fb005c21-02e7-f387-1cad-8acd2d8df0c8')) // then the characteristics
 //   .then(characteristic => characteristic.startNotifications())
 //   .then(characteristic => {
 //       return characteristic.readValue();
        /* characteristic.addEventListener('characteristicvaluechanged', handleCharacteristicValueChanged); */ // then we subscribe to the characteristic notifications
 //   })
 //   .then(value => {
 //       console.log(value);
 //   })                                                                                                    // and set the callback function
 //   .catch(error => { console.error(error);
 //   }); // we display the errors on the console 
}


function deviceInformationService(characteristics) {
    let queue = Promise.resolve();
    let decoder = new TextDecoder('utf-8');
    characteristics.forEach(characteristic => {
      switch (characteristic.uuid) {

        case BluetoothUUID.getCharacteristic('manufacturer_name_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> Manufacturer Name String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('model_number_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> Model Number String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('hardware_revision_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> Hardware Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('firmware_revision_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> Firmware Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('software_revision_string'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> Software Revision String: ' + decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('system_id'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> System ID: ');
            console.log('  > Manufacturer Identifier: ' +
                padHex(value.getUint8(4)) + padHex(value.getUint8(3)) +
                padHex(value.getUint8(2)) + padHex(value.getUint8(1)) +
                padHex(value.getUint8(0)));
            console.log('  > Organizationally Unique Identifier: ' +
                padHex(value.getUint8(7)) + padHex(value.getUint8(6)) +
                padHex(value.getUint8(5)));
          });
          break;

        case BluetoothUUID.getCharacteristic('ieee_11073-20601_regulatory_certification_data_list'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> IEEE 11073-20601 Regulatory Certification Data List: ' +
                decoder.decode(value));
          });
          break;

        case BluetoothUUID.getCharacteristic('pnp_id'):
          queue = queue.then(_ => characteristic.readValue()).then(value => {
            console.log('> PnP ID:');
            console.log('  > Vendor ID Source: ' +
                (value.getUint8(0) === 1 ? 'Bluetooth' : 'USB'));
            if (value.getUint8(0) === 1) {
              console.log('  > Vendor ID: ' +
                  (value.getUint8(1) | value.getUint8(2) << 8));
            } else {
              console.log('  > Vendor ID: ' +
                  getUsbVendorName(value.getUint8(1) | value.getUint8(2) << 8));
            }
            console.log('  > Product ID: ' +
                (value.getUint8(3) | value.getUint8(4) << 8));
            console.log('  > Product Version: ' +
                (value.getUint8(5) | value.getUint8(6) << 8));
          });
          break;

        default: console.log('> Unknown Characteristic: ' + characteristic.uuid);
      }
    });
    return queue;
}

function padHex(value) {
    return ('00' + value.toString(16).toUpperCase()).slice(-2);
}

function getUsbVendorName(value) {
    // Check out page source to see what valueToUsbVendorName object is.
    return value +
        (value in valueToUsbVendorName ? ' (' + valueToUsbVendorName[value] + ')' : '');
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

