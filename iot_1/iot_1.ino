#include <Servo.h>
#include <string.h>
#include <stdlib.h>

#define LED_01 13 // LED_Red
#define LED_02 12 // LED_Green
#define LED_03 11 // LED_Blue

#define LED_NUM 3
unsigned int ledArray[] = { LED_01, LED_02, LED_03 } ;
// temp에 관한 변
const int TEMP = A0;

void setup() {
  Serial.begin(9600);

  for (int i = 0 ; i < LED_NUM ; i++) {
    pinMode(ledArray[i], OUTPUT) ;
  }
}

void loop() {
  String type;
  long color = 0;
  if (Serial.available()) {
    String getString = Serial.readString();

    int index1 = getString.indexOf('/');
    int index2 = getString.length();
    type = getString.substring(0, index1);
    String colorHex = getString.substring(index1 + 1, index2);  //FF0000
    String frontHex = "0x";
    colorHex = frontHex + colorHex;   // 문자 합친거: 0xff0000

    // colorHex.c_str() -> colorHex 문자배열로 변환
    color = (long)strtol(colorHex.c_str(), NULL, 16);
  }
  // type 나누는 부분
  if (type == "color") {
    setColor(color);
  } else if (type == "temp") {
    int val = analogRead(TEMP);

    float valu = val * 5000.0 / 1024.0;
    float TempDotC = (valu - 500) / 10.0;

    Serial.print(TempDotC);
    Serial.println("ºC");

    if (TempDotC < 20) {
      setColor(0x0000FF);
    } else if (20 < TempDotC && TempDotC < 22) {
      setColor(0x008080);
    } else if (22 < TempDotC && TempDotC < 24) {
      setColor(0x00FF00);
    }  else if (24 <= TempDotC && TempDotC < 26) {
      setColor(0xFFFF00);
    } else if (26 <= TempDotC && TempDotC < 28) {
      setColor(0xFFA500);
    } else {
      setColor(0xFF0000);
    }
  }
}

void setColor(long color) {
  analogWrite(ledArray[0], color >> 16);
  analogWrite(ledArray[1], color >> 8 & 0xFF);
  analogWrite(ledArray[2], color & 0xFF);
}