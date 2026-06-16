#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <DHT.h>

// -------- DHT11 Setup --------
#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// -------- LCD Setup --------
LiquidCrystal_I2C lcd(0x27, 16, 2);

// -------- Candidate Name --------
String name = "Ishema Shimwa Shoulamite";

// -------- Variables for scrolling --------
int scrollIndex = 0;
unsigned long lastScrollTime = 0;
unsigned long lastTempTime = 0;

void setup() {
  lcd.init();
  lcd.backlight();

  dht.begin();
  Serial.begin(9600);
}

void displayNameScroll() {
  String displayText;

  if (name.length() <= 16) {
    displayText = name;
  } else {
    displayText = name.substring(scrollIndex, scrollIndex + 16);

    scrollIndex++;
    if (scrollIndex > name.length() - 16) {
      scrollIndex = 0;
    }
  }

  lcd.setCursor(0, 0);
  lcd.print("                "); // clear line
  lcd.setCursor(0, 0);
  lcd.print(displayText);
}

void loop() {

  // -------- Scroll name every 300ms --------
  if (millis() - lastScrollTime >= 300) {
    displayNameScroll();
    lastScrollTime = millis();
  }

  // -------- Read temperature every 2 seconds --------
  if (millis() - lastTempTime >= 2000) {

    float temp = dht.readTemperature();

    // Handle sensor error
    if (isnan(temp)) {
      lcd.setCursor(0, 1);
      lcd.print("Sensor Error   ");
      Serial.println("Sensor Error");
      return;
    }

    // Display on LCD
    lcd.setCursor(0, 1);
    lcd.print("                ");
    lcd.setCursor(0, 1);
    lcd.print("Temp: ");
    lcd.print(temp);
    lcd.print(" C");

    // Send to PC (Serial Monitor)
    Serial.print("Temperature: ");
    Serial.print(temp);
    Serial.println(" C");

    lastTempTime = millis();
  }
}