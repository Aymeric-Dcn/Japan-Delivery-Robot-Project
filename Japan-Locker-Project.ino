#define TRIG_PIN 39
#define ECHO_PIN 40
#define LED_PIN 6
#define DELAY   500 // This delay represents the sampling of the distance, change if you want sampling faster of slower


long duration;
float distance;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(LED_PIN, OUTPUT);

  digitalWrite(TRIG_PIN, LOW);
  Serial.begin(115200);
}

void loop() {

  // Internal variables
  float distance_Buffer;
  // Pulse trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  // Reading echo
  duration = pulseIn(ECHO_PIN, HIGH, 30000);

  // Conversion in cm
  distance = duration * 0.017;
 
  Serial.println("Distance = ");
  Serial.println(distance);
  Serial.println("cm");
  distance_Buffer = distance;
  delay(DELAY);


  // Object detected (less than 1m) One can use it as test or debug purposes
  if (distance > 0 && distance < 100) {
    Serial.println("Obstacle detected !");
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }


  delay(50);
}