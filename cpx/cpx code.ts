/* 
Aparte modus maken waarin je dryness value kan aanpassen, 
kan aanpassen hoeveel licht de plant nodig heeft
en kan aanpassen hoe warm de plant het moet hebben
*/

let SoilReading = 0;
let WaterReading = 0;
let DryValue = 1500;
let ReserviorHasWater = false;
light.setBrightness(45);

light.clear();


// Geeft plant water en houdt in de gaten of de plant niet teveel krijgt
function waterPlants() {
    light.clear();
    while (SoilReading < DryValue) {
        while (ReserviorHasWater) {
            crickit.motor1.run(60);
            pause(100);
            crickit.motor1.run(40);
            pause(1000);
            crickit.motor1.stop();
            pause(5000);
            SoilReading = input.pinA2.value();
            console.logValue("Soil reading", SoilReading);
        }
    }
}


control.runInParallel(function checkWaterReservior() {
    while (true) {
        WaterReading = input.pinA7.value();

        if (WaterReading < 1) {
            ReserviorHasWater = true;
        } else {
            ReserviorHasWater = false;
        }

        pause(100);
    }
});


forever(function () {
    SoilReading = input.pinA2.value();
    console.logValue("Soil reading", SoilReading);
    if (SoilReading <= DryValue) {
        light.setAll(0xff0000); // later vervangen voor output LED
        waterPlants();
    } else {
        light.setAll(Colors.Green); // later vervangen voor output LED
    }
    pause(2000);
})
