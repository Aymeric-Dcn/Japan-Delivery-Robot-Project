//-----------------PLEASE PAY ATTENTION TO THE LAYOUT OF THE PCB!!!!---------------------------//
#define TRIG_PIN_1 39
#define ECHO_PIN_1 40

#define TRIG_PIN_2 8
#define ECHO_PIN_2 10

#define NO_PIN_1   38

#define LED_PIN     6

#define Solenoid_pin   15 


// This delay represents the sampling of the distance
// change if you want sampling faster or slower

#define DELAY 100

const int trigPins[2] = { 39, 8 };
const int echoPins[2] = { 40, 10 };

void setup() {
  // Sensors setup

  for (int i = 0; i < 2; i++) {
    pinMode(trigPins[i], OUTPUT);
    pinMode(echoPins[i], INPUT);
    pinMode(Solenoid_pin, OUTPUT);

    digitalWrite(trigPins[i], LOW);
  }

  // Closing sensor

  pinMode(NO_PIN_1, INPUT_PULLUP);

  // LED setup

  pinMode(LED_PIN, OUTPUT);

  // Serial setup

  Serial.begin(115200);
}

void loop() {
  // Internal variables

  float detection_filtered[2];
  char  lock_state = -1;
  // -------------Ultrosonic part---------------- //
  // Reading sensors

  for (int i = 0; i < 2; i++) {
    detection_filtered[i] =
      medianDistance(trigPins[i], echoPins[i]);
  }

  // Sensors printing

  for (int i = 0; i < 2; i++) {
    Serial.print("Sensor ");
    Serial.print(i + 1);
    Serial.print(" : ");

    if (detection_filtered[i] == -1) {
      Serial.println("No detection");
    } else {
      Serial.print(detection_filtered[i], 1);
      Serial.println(" cm");
    }
  }

  Serial.println("-------------------");

  // Object detected (less than 1m)
  // One can use it as test or debug purposes

  bool obstacleDetected = false;

  for (int i = 0; i < 2; i++) {
    if (detection_filtered[i] > 0 && detection_filtered[i] < 100) {
      obstacleDetected = true;
    }
  }

  if (obstacleDetected) {
    Serial.println("Obstacle detected !");
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  delay(DELAY);

  //----------------Closing Part-------------------//
  lock_state = digitalRead(NO_PIN_1);

  if (lock_state == LOW)
  {
    Serial.println("Door closed");
  }
  else (Serial.println("Door open"));
  // Locking Part
  digitalWrite(Solenoid_pin, HIGH);

  delay(1000);  
  digitalWrite(Solenoid_pin, LOW);

  delay(1000);
}

float UltrasonicSensorReading(int trig_pin,
                              int echo_pin) {
  long duration;
  float distance;

  // Pulse trigger

  digitalWrite(trig_pin, LOW);
  delayMicroseconds(2);

  digitalWrite(trig_pin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trig_pin, LOW);

  // Reading echo

  duration = pulseIn(echo_pin,
                     HIGH,
                     30000);

  // timeout

  if (duration == 0) {
    return -1;
  }

  // Convert in cm

  distance = duration * 0.017;

  return distance;
}

float medianDistance(int trigPin,
                     int echoPin) {
  float values[5];

  // Storing 5 values

  for (int i = 0; i < 5; i++) {
    values[i] =
      UltrasonicSensorReading(trigPin,
                              echoPin);

    delay(20);
  }

  // Bubble sort

  for (int i = 0; i < 4; i++) {
    for (int j = i + 1; j < 5; j++) {
      if (values[j] < values[i]) {
        float temp = values[i];

        values[i] = values[j];
        values[j] = temp;
      }
    }
  }

  // Median value

  return values[2];
}