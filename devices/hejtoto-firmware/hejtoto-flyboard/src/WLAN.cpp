// // WLAN.cpp

// #include <WLAN.h>
// #include <WiFi.h>

// const char *ssid = "hejtoto";        // Your WiFi network name
// const char *password = "Poelich123"; // Your WiFi network password

// void init_WLAN()
// {
//     WiFi.begin(ssid, password);
//     Serial.print("Connecting to WiFi");

//     while (WiFi.status() != WL_CONNECTED)
//     {
//         delay(500);
//         Serial.print(".");
//     }

//     Serial.println();
//     Serial.print("Connected to WiFi, IP address: ");
//     Serial.println(WiFi.localIP());
// }