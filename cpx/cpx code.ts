
/* 
Aparte modus maken waarin je dryness value kan aanpassen, 
kan aanpassen hoeveel licht de plant nodig heeft
en kan aanpassen hoe warm de plant het moet hebben
*/

let SoilReading = 0;
let WaterReading = 0;
const DryValue = 800;
const HighTemperature = 25;
let CurrentTemperature = 0;
let ReservoirHasWater = false;
let LoggingEnabled = true;
let CurrentLightLevel = 0;
const LowLightLevel = 180;

light.setBrightness(45);
light.clear();

// Datalogger
datalogger.setEnabled(true);
datalogger.setSampleInterval(1000);

// Geeft plant water en houdt in de gaten of de plant niet teveel krijgt
function waterPlants() {
    while (SoilReading < DryValue) {
        if (!ReservoirHasWater) {
            crickit.motor1.stop();
            light.setPixelColor(0, Colors.Indigo)
            light.setPixelColor(1, Colors.Indigo)
            light.setPixelColor(2, Colors.Indigo)
            light.setPixelColor(3, Colors.Indigo)
            light.setPixelColor(4, Colors.Indigo)
            return;
        }

        crickit.motor1.run(60);

        for (let i = 0; i < 150; i++) {
            if (!ReservoirHasWater) {
                crickit.motor1.stop();
                light.setPixelColor(0, Colors.Indigo)
                light.setPixelColor(1, Colors.Indigo)
                light.setPixelColor(2, Colors.Indigo)
                light.setPixelColor(3, Colors.Indigo)
                light.setPixelColor(4, Colors.Indigo)
                return;
            }
            pause(20);
        }

        crickit.motor1.stop();

        for (let i = 0; i < 250; i++) {
            if (!ReservoirHasWater) {
                light.setPixelColor(0, Colors.Indigo)
                light.setPixelColor(1, Colors.Indigo)
                light.setPixelColor(2, Colors.Indigo)
                light.setPixelColor(3, Colors.Indigo)
                light.setPixelColor(4, Colors.Indigo)
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

        if (WaterReading > 900) {
            ReservoirHasWater = true;
        } else {
            ReservoirHasWater = false;
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
        console.logValue("Reservoir", ReservoirHasWater ? 1 : 0);

        // Datalogger
        if (LoggingEnabled) {
            datalogger.addValue("Soil", SoilReading);
            datalogger.addValue("Water", WaterReading);
            datalogger.addValue("Reservoir", ReservoirHasWater ? 1 : 0);
            datalogger.addRow();
        }

        pause(1000);
    }
});

forever(function () {
    SoilReading = input.pinA2.value();

    if (SoilReading <= DryValue) {
        light.setPixelColor(0, Colors.Red)
        light.setPixelColor(1, Colors.Red)
        light.setPixelColor(2, Colors.Red)
        light.setPixelColor(3, Colors.Red)
        light.setPixelColor(4, Colors.Red)
        waterPlants();
    } else {
        light.setPixelColor(0, Colors.Green)
        light.setPixelColor(1, Colors.Green)
        light.setPixelColor(2, Colors.Green)
        light.setPixelColor(3, Colors.Green)
        light.setPixelColor(4, Colors.Green)
    }

    pause(2000);
})


forever(function () {
    CurrentTemperature = input.temperature(TemperatureUnit.Celsius)

    console.log("Temperature: " + CurrentTemperature + " °C")
    if (CurrentTemperature > HighTemperature) {
        light.setPixelColor(5, Colors.Orange)
        light.setPixelColor(6, Colors.Orange)
        light.setPixelColor(7, Colors.Orange)
        light.setPixelColor(8, Colors.Orange)
        light.setPixelColor(9, Colors.Orange)
    }
    else if (CurrentTemperature > 15) {
        light.setPixelColor(5, Colors.Green)
        light.setPixelColor(6, Colors.Green)
        light.setPixelColor(7, Colors.Green)
        light.setPixelColor(8, Colors.Green)
        light.setPixelColor(9, Colors.Green)
    }
    else {
        light.setPixelColor(5, Colors.Blue)
        light.setPixelColor(6, Colors.Blue)
        light.setPixelColor(7, Colors.Blue)
        light.setPixelColor(8, Colors.Blue)
        light.setPixelColor(9, Colors.Blue)
    }



    CurrentLightLevel = input.lightLevel()
    console.log(CurrentLightLevel)
    if (CurrentLightLevel < LowLightLevel) {
        light.setBrightness(0)
        pause(500)
        light.setBrightness(255)
        pause(500)
    } else {
        light.setBrightness(255)
    }
})




