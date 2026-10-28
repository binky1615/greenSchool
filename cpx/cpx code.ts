
/* 
Aparte modus maken waarin je dryness value kan aanpassen, 
kan aanpassen hoeveel licht de plant nodig heeft
en kan aanpassen hoe warm de plant het moet hebben
*/

let SoilReading = 0;
let WaterReading = 0;
let DryValue = 800;
let ReserviorHasWater = false;
let LoggingEnabled = true;

light.setBrightness(45);
light.clear();

// Datalogger
datalogger.setEnabled(true);
datalogger.setSampleInterval(1000);

// Geeft plant water en houdt in de gaten of de plant niet teveel krijgt
function waterPlants() {
    while (SoilReading < DryValue) {
        if (!ReserviorHasWater) {
            crickit.motor1.stop();
            light.setAll(Colors.Indigo);
            return;
        }

        crickit.motor1.run(60);
        pause(100);

        if (!ReserviorHasWater) {
            crickit.motor1.stop();
            light.setAll(Colors.Indigo);
            return;
        }

        crickit.motor1.run(40);

        for (let i = 0; i < 50; i++) {
            if (!ReserviorHasWater) {
                crickit.motor1.stop();
                light.setAll(Colors.Indigo);
                return;
            }
            pause(20);
        }

        crickit.motor1.stop();

        for (let i = 0; i < 250; i++) {
            if (!ReserviorHasWater) {
                light.setAll(Colors.Indigo);
                return;
            }
            pause(20);
        }

        SoilReading = input.pinA2.value();
    }
}

control.runInParallel(function checkWaterReservior() {
    while (true) {
        WaterReading = input.pinA7.value();

        if (WaterReading > 800) {
            ReserviorHasWater = true;
        } else {
            ReserviorHasWater = false;
        }

        pause(100);
    }
});

// Sensorwaarden onafhankelijk loggen
control.runInParallel(function logSensorValues() {
    while (true) {
        // Sensorwaarden uitlezen
        SoilReading = input.pinA2.value();
        WaterReading = input.pinA7.value();

        // Console grafiek
        console.logValue("Soil", SoilReading);
        console.logValue("Water", WaterReading);
        console.logValue("Reservoir", ReserviorHasWater ? 1 : 0);

        // Datalogger
        if (LoggingEnabled) {
            datalogger.addValue("Soil", SoilReading);
            datalogger.addValue("Water", WaterReading);
            datalogger.addValue("Reservoir", ReserviorHasWater ? 1 : 0);
            datalogger.addRow();
        }

        pause(1000);
    }
});

forever(function () {
    SoilReading = input.pinA2.value();

    if (SoilReading <= DryValue) {
        light.setAll(0xff0000);
        waterPlants();
    } else {
        light.setAll(Colors.Green);
    }

    pause(2000);
});
