# Mosquitto Light Trap IoT Controller

A Progressive Web App (PWA) for monitoring and controlling mosquitto light traps using ESP8266, ThingSpeak, and modern web technologies.

## Features

- **Real-time Monitoring**: Track battery levels, solar panel output, LDR sensor readings, temperature, and humidity
- **Remote Control**: Turn trap on/off, adjust intensity, and set operating modes
- **ThingSpeak Integration**: Seamless data logging and retrieval from ThingSpeak IoT platform
- **Progressive Web App**: Install on mobile devices for native app experience
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Historical Data**: View 24-hour charts of all sensor readings
- **Offline Support**: Service worker enables offline functionality

## ThingSpeak Setup

1. Create a free account at [ThingSpeak.com](https://thingspeak.com)
2. Create a new channel with the following 8 fields:
   - **Field 1**: Battery Level (%)
   - **Field 2**: Solar Voltage (V)
   - **Field 3**: Solar Current (A)
   - **Field 4**: LDR Raw Value (0-1024)
   - **Field 5**: Temperature (°C)
   - **Field 6**: Humidity (%)
   - **Field 7**: Trap Status (0=Off, 1=On)
   - **Field 8**: Trap Intensity (0-100%)

3. Note your Channel ID and API Keys from the channel settings
4. Configure the app using the ThingSpeak Configuration panel

## ESP8266 Integration

Your ESP8266 should send data to ThingSpeak using HTTP POST requests:

```cpp
// Example ESP8266 code snippet
String url = "http://api.thingspeak.com/update?api_key=YOUR_WRITE_API_KEY";
url += "&field1=" + String(batteryLevel);
url += "&field2=" + String(solarVoltage);
url += "&field3=" + String(solarCurrent);
url += "&field4=" + String(ldrValue);
url += "&field5=" + String(temperature);
url += "&field6=" + String(humidity);
url += "&field7=" + String(trapStatus);
url += "&field8=" + String(trapIntensity);

HTTPClient http;
http.begin(url);
int httpCode = http.GET();
```

## Hardware Components

- **ESP8266**: Main microcontroller
- **LDR Sensor**: Light level detection
- **Solar Panel**: Power generation monitoring
- **Car Battery**: Power storage with voltage monitoring
- **Temperature/Humidity Sensor**: Environmental monitoring
- **Relay/MOSFET**: Trap control circuit

## Installation

1. Clone this repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`
4. Configure ThingSpeak settings in the app
5. Build for production: `npm run build`

## PWA Installation

Users can install this app on their mobile devices:
1. Open the app in a mobile browser
2. Look for "Add to Home Screen" prompt
3. Follow installation instructions
4. Launch from home screen like a native app

## Data Update Frequency

- **Real-time updates**: Every 20 seconds (respects ThingSpeak free tier limits)
- **Historical data refresh**: Every 5 minutes
- **Control commands**: Immediate with 2-second confirmation delay

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with PWA support

## License

MIT License - feel free to modify and use for your IoT projects.