/* 
Aparte modus maken waarin je dryness value kan aanpassen, 
kan aanpassen hoeveel licht de plant nodig heeft
en kan aanpassen hoe warm de plant het moet hebben
*/

let soil_reading = 0
let dry_value = 1500
light.setBrightness(45)
light.clear()


// Geeft plant water en houdt in de gaten of de plant niet teveel krijgt
function waterPlants() {



}

forever(function () {
    soil_reading = input.pinA1.value()
    console.logValue("Soil reading", soil_reading)
    if (soil_reading <= dry_value) {
        light.setAll(0xff0000) // later vervangen voor output LED
        waterPlants()
    } else {
        light.setAll(Colors.Green) // later vervangen voor output LED
    }
    pause(2000)
})

