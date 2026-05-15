#define TRIG_PIN 39
#define ECHO_PIN 40
#define LED_PIN 6

long duration;
float distance;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(LED_PIN, OUTPUT);

  digitalWrite(TRIG_PIN, LOW);
}

void loop() {

  // Pulse trigger
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);

  digitalWrite(TRIG_PIN, LOW);

  // Lecture echo
  duration = pulseIn(ECHO_PIN, HIGH, 30000);

  // Conversion distance cm
  distance = duration * 0.017;

  // Objet détecté à moins de 20 cm
  if (distance > 0 && distance < 20) {
    digitalWrite(LED_PIN, HIGH);
  } else {
    digitalWrite(LED_PIN, LOW);
  }

  delay(50);
}