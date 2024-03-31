// GPB0 - DIR 1
// GPB1 - PDN1
// GPB2 - EN1

// !CS -> GND (we ue the fixed MCP_ADDRESS instead)
// !Reset-Pin is tied vie 10k resistor to 3V3
// MCP23S17 via SPI -> Teensy 4.1 (Pin 11 Mosi, 12 Miso, 14 SCK)

#include <Adafruit_MCP23X17.h>

// Declaration des pins ESP-VROOM-32 CV (202310281429)
#define spi_CS 5
#define spi_RST 4
#define spi_MOSI 23 // Data out
#define spi_MISO 19 // Data out
#define spi_SCLK 18 // Clock out

#define dig_0 0b00111111
#define dig_1 0b00000110
#define dig_2 0b01011011
#define dig_3 0b01001111
#define dig_4 0b01100110
#define dig_5 0b01101101
#define dig_6 0b01111101
#define dig_7 0b00000111
#define dig_8 0b01111111
#define dig_9 0b01101111
#define dig_dp 0b10000000

// Stepper 12 Pins
#define Stepper1 (STEP1 DIR1)
#define Stepper2 (STEP2 DIR2)
#define Stepper3 (STEP3 DIR3)
#define Stepper4 (STEP4 DIR4)
#define Stepper5 (STEP5 DIR5)
#define Stepper6 (STEP6 DIR6)
// Stepper PND 2 Pins
#define TX
#define RX

#define t1 100
#define t2 1000

Adafruit_MCP23X17 mcp;

// Declaration des variables generales

int cpt_max = 100; // valeur maximale pour le comptage sur les afficheurs
int nb_digit = 2;  // Nombre d'afficheur à prendre en compte dans l'affichage (valeur max 8)

int digit[] = {dig_0, dig_1, dig_2, dig_3, dig_4, dig_5, dig_6, dig_7, dig_8, dig_9, dig_dp}; // tableau decimal -> 7 segments
char dig[] = {' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '};                                        // tableau de digits
int cpt_digit = 0;                                                                            // Comptage digit
int longueur = 0;                                                                             // Longueur du compteur en nombre de digit
int cpt_debug = 0;                                                                            // variable de debug

void setup()
{

  Serial.begin(115200);
  // while (!Serial);
  Serial.println("MCP23S17 8 segments blink tests !");

  // configure pin RST for output
  pinMode(spi_RST, OUTPUT);
  // Mettre RESET a l'etat haut
  digitalWrite(spi_RST, HIGH);

  // begin_SPI (int8_t cs_pin, int8_t sck_pin, int8_t miso_pin, int8_t mosi_pin, uint8_t _hw_addr=0x00)
  if (!mcp.begin_SPI(spi_CS, spi_SCLK, spi_MISO, spi_MOSI, 0x0))
  {
    Serial.println("Error.");
    while (1)
      ;
  }
  // Prise en compte des adresses A0 A1 et A2
  mcp.enableAddrPins();

  // configure all pins (GPA0) for output
  for (byte currentPin = 0; currentPin < 8; currentPin++)
  {
    mcp.pinMode(currentPin, OUTPUT);
  }

  Serial.println("Looping...");
}

void loop()
{

  for (int cpt = 0; cpt < cpt_max; cpt++)
  { // compteur de 0 à valeur max - 1 (valeur max = 10^nb_digit)
    cpt_debug++;
    delay(t1);
    sprintf(dig, "%d", cpt);
    longueur = 0;
    for (int i = 0; i <= nb_digit; i++)
    {
      if (dig[i] >= 0x30 and dig[i] <= 0x39)
      {
        longueur = i + 1;
      }
    }
    for (int num_digit = 0; num_digit < nb_digit; num_digit++)
    { // Gestion de l'affichage digit par digit en commençant par le point le plus fort (à gauche)
      cpt_digit = dig[num_digit] - 0x30;
      aff_digit(cpt_digit, num_digit + 1);
    }
    Serial.print("Compteur = ");
    Serial.print(cpt);
    Serial.print(" Longueur = ");
    Serial.print(longueur);
    Serial.print(" Bcl = ");
    Serial.println(cpt_debug);
  }
  delay(t2);
}

void aff_digit(int valeur, int address)
{

  if (valeur < 0)
  {
    valeur = 0;
  }

  if (!mcp.begin_SPI(spi_CS, spi_SCLK, spi_MISO, spi_MOSI, address))
  {
    Serial.println("Error.");
    while (1)
      ;
  }
  // configure all pins (GPA0) for output
  for (byte currentPin = 0; currentPin < 8; currentPin++)
  {
    mcp.pinMode(currentPin, OUTPUT);
  }
  // Prise en compte des adresses A0 A1 et A2
  mcp.enableAddrPins();

  mcp.writeGPIOA(digit[valeur]);
  Serial.print("Digit");
  Serial.print(address);
  Serial.print(" Valeur ");
  Serial.println(valeur);
}