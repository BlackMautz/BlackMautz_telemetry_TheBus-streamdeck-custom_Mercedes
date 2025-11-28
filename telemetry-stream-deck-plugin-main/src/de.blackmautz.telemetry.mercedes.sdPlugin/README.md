# The Bus - Stream Deck Telemetry Plugin (BlackMautz Custom Edition - SOLARIS)

Ein **angepasstes Stream Deck Plugin** für die Steuerung von **The Bus** Simulatoren über die TML Studios Telemetry API.

**🚍 SOLARIS VERSION** - Speziell für Solaris Urbino 18m & 12m

## 📋 Übersicht

Dieses Plugin ist eine **erweiterte Custom Edition** mit zusätzlichen Features und Verbesserungen, **100% optimiert für Solaris Urbino** Busse (18m / 12m).

**🚍 NUR FÜR SOLARIS URBINO BUSSE**
- ✅ **Solaris Urbino 18m** - Vollständig getestet und kompatibel
- ✅ **Solaris Urbino 12m** - Vollständig getestet und kompatibel
- ❌ **Andere Busmodelle** - NICHT KOMPATIBEL (z.B. SCANIA, Mercedes, MAN)

**Für andere Bus-Modelle benötigen Sie separate Plugin-Versionen!**

### 🎮 Credits & Original

**The Bus - Bus Simulator**
- **Entwickler**: TML Studios
- **Website**: https://www.tml-studios.de/
- **Steam**: https://store.steampowered.com/app/1193090/The_Bus/

**Original Telemetry Plugin**
- **Quelle**: TML Studios
- **Lizenz**: Freeware (von TML Studios bereitgestellt)

**Diese Custom Edition**
- **Entwickler**: BlackMautz
- **Repository**: https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Solaris
- **Basis**: TML Studios Telemetry Plugin mit umfangreichen Erweiterungen

### ⭐ BlackMautz Custom Edition Features
- ✅ **LED Monitor** - 63 LEDs zur Überwachung aller Bus-Systeme
- ✅ **Passengers Button** - 7 Dropdown-Optionen für Passagier-Infos
- ✅ **Engine Info Button** - 8 Dropdown-Optionen für Motor-Daten
- ✅ **Speed Display** - Dynamisches Icon basierend auf Tempolimit
- ✅ **Fuel Display** - Live Kraftstoff-Anzeige mit Warnung
- ✅ **Climate Control** - 10 Optionen für Klimasteuerung
- ✅ **Infos Button** - Heizungs- und Haltewunsch-Status
- ✅ **Stop Request** - Zeigt Türnummern für Haltewünsche
- ✅ **Pantograph** - Status-LED zeigt Verbindung (elektrische Busse)
- ✅ **Camera Switch** - Kamerawechsel mit Custom Icon
- ✅ **Window Control** - Icons für Fahrerfenster (öffnen/schließen)
- ✅ Erweiterte Türsteuerung mit Live Status-Anzeige
- ✅ Kneeling/Lifting mit Toggle- und Direkt-Modi
- ✅ Wiper Level Anzeige
- ✅ Verbesserte Icon-Unterstützung
- ✅ Viele Bug-Fixes und Optimierungen

---

## 🚀 Installation

### Methode 1: Installationsdatei (EINFACH - Empfohlen)
1. Lade `BlackMautz_TheBus_Solaris.streamDeckPlugin` von GitHub herunter
2. Doppelklick auf die Datei
3. Stream Deck installiert automatisch
4. Fertig! 🎉

**⚠️ WICHTIG: Nur mit Solaris Urbino 18m/12m nutzen!**

### Methode 2: Manuell (für Entwickler)
1. Repository klonen: `git clone https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom.git`
2. Stream Deck beenden
3. Ordner `de.tml-studios.telemetry.sdPlugin` nach `%APPDATA%\Elgato\StreamDeck\Plugins\` kopieren
4. Stream Deck neu starten

---

## 🎮 Unterstützte Spiele

- **The Bus** (TML Studios)

### ✅ Vollständig getestete Fahrzeuge (READY)
- ✅ **Solaris Urbino 18m 4D** - 100% aller Features getestet & funktionsfähig ⭐
- ✅ **Solaris Urbino 12m 3D** - Alle Features getestet & funktionsfähig ⭐

**Status:** Alle Solaris Urbino Modelle vollständig kompatibel!

### 🔄 Automatische Bus-Erkennung
Das Plugin erkennt **automatisch** welchen Bus du fährst und passt sich an:
- Wechsle zwischen Bussen ohne Plugin neu zu starten
- Unterschiedliche Busse = unterschiedliche Werte (Sitze, Tank, etc.)
- Vehicle ID wird automatisch aktualisiert

### ⚠️ Andere Fahrzeuge
Grundfunktionen sollten bei allen The Bus Fahrzeugen funktionieren (nicht vollständig getestet).

---

## 🔧 Konfiguration

### API Einstellungen
- **Standard IP**: `127.0.0.1`
- **Standard Port**: `37337`
- **API Endpoint**: `/vehicles/{VehicleName}?vars=...`

### Erster Start
1. Button auf Stream Deck ziehen
2. Property Inspector öffnen (Zahnrad-Symbol)
3. IP und Port prüfen (Standard sollte passen)
4. Spiel starten und Bus auswählen
5. Plugin sollte automatisch verbinden

---

## 📦 Verfügbare Buttons

### 🚪 Türsteuerung
| Button | Beschreibung | Features |
|--------|--------------|----------|
| **Door Button** | Haupttürschalter | An/Aus Toggle |
| **Door 1-4** | Einzelne Türen | Status-Anzeige mit Icons |
| **Door Clearance** | Türfreigabe (USB) | LED-Status live |
| **Door Autoclose** | Auto-Schließen | An/Aus Toggle |
| **Door Lock Left/Right** | Türen sperren | Separate Links/Rechts |

### ⚙️ Getriebe
| Button | Beschreibung |
|--------|--------------|
| **Gear Selector** | Dropdown: D/N/R auswählen |
| **Gear Drive** | D-Gang direkt |
| **Gear Neutral** | N-Leerlauf direkt |
| **Gear Reverse** | R-Rückwärts direkt |

### 💡 Beleuchtung
| Button | Beschreibung | LED |
|--------|--------------|-----|
| **Light Switch** | Scheinwerfer | ✅ |
| **Main Light** | Standlicht | ✅ |
| **Traveller Lights** | Fernlicht | ✅ |
| **Fog Light Front** | Nebelscheinwerfer vorne | ✅ |
| **Fog Light Rear** | Nebelscheinwerfer hinten | ✅ |
| **Warning Light** | Warnblinkanlage | ✅ |
| **Interior Light** | Innenbeleuchtung (4 Modi) | ✅ |

### 🌡️ Klimaanlage (Climate Control)
**Dropdown-Button mit 10 Optionen:**

#### Steuerung:
- **Air Condition Toggle** - Klimaanlage an/aus
- **Temperature Up** - Wärmer
- **Temperature Down** - Kälter
- **Airflow Toggle** - Luftstrom an/aus
- **Airflow Left** - Luftstrom Stufe runter
- **Airflow Right** - Luftstrom Stufe hoch
- **Climate Mode** - Klimaanlage starten

#### Live-Anzeigen:
- **Fan Speed Display** - Lüfter-Geschwindigkeit (0-100%)
- **Driver Temp Display** - Fahrer-Temperatur (0-100%)
- **AC Temp Display** - Klima-Temperatur (0-100%)

**Features:**
- ✅ Checkbox zum Ein/Ausblenden der Temperatur-Info
- ✅ Live-Updates alle 300ms
- ✅ Persistente Auswahl-Speicherung

### 🔽 Kneeling/Lifting
**Dropdown-Button mit 7 Optionen:**

#### Toggle-Modi (Ein Button für beide Richtungen):
- **Kneeling Toggle** - Absenken ↔ Anheben umschalten
- **Lifting Toggle** - Heben ↔ Senken umschalten
- **Lift Reset** - Zurücksetzen Toggle

#### Direkt-Aktionen (Separate Buttons):
- **Kneel Down** - Nur absenken
- **Kneel Up** - Nur anheben
- **Lift Up** - Nur heben
- **Lift Down** - Nur senken

**Features:**
- ✅ Icons wechseln automatisch (kneeling.png ↔ kneeling-on.png)
- ✅ Checkbox für Status-Text ein/aus
- ✅ State-Tracking für Toggle-Modi

### 🛑 Bremsen
| Button | Beschreibung | LED | Icons |
|--------|--------------|-----|-------|
| **Parking Brake** | Feststellbremse | ✅ | Icon_Brake_Off/On.png |
| **Stop Brake** | Haltestellenbremse (Toggle) | ✅ | HaltestelleBremse.png / HaltestelleBremse_on.png |
| **Fixing Brake** | Feststellbremse Dashboard | ✅ | Icon_Brake_Off/On.png |

**Features:**
- ✅ Live LED-Status-Anzeige
- ✅ Korrekte Schwellenwerte (>= 1.0 für aktiv)
- ✅ Icons wechseln automatisch bei Aktivierung

### 👥 Passengers (Dropdown)
**Display-Only Button mit 7 Dropdown-Optionen:**

- **Occupied Seats** - Belegte / Gesamt Sitze (z.B. "0 / 36")
- **Total Seats** - Gesamtanzahl Sitzplätze
- **Passenger Load** - Fahrgast-Last in %
- **Total Mass** - Gesamtmasse in kg
- **Doors Open** - Anzahl offener Türen
- **Passenger Doors** - Passagiertüren Status (OPEN/CLOSED)
- **Luggage Doors** - Gepäcktüren Status (OPEN/CLOSED)

**Features:**
- ✅ Live-Updates alle 300ms
- ✅ Dropdown-Auswahl wird persistent gespeichert
- ✅ Icon: sonderzeichen18.png

### 🔧 Engine Info (Dropdown)
**Display-Only Button mit 8 Dropdown-Optionen:**

- **Engine Status** - Motor läuft (RUNNING/OFF)
- **Ignition** - Zündung Status (ON/OFF)
- **RPM** - Drehzahl (Umdrehungen/min)
- **Engine Temperature** - Motortemperatur in %
- **Throttle** - Gaspedal-Position in %
- **Gearbox** - Aktueller Gang (D/N/R)
- **Brake** - Bremse in %
- **Cruise Control** - Tempomat Status (ACTIVE/OFF)

**Features:**
- ✅ Live-Updates alle 300ms
- ✅ Dropdown-Auswahl wird persistent gespeichert
- ✅ Icon: sonderzeichen18.png

### 🚗 Speed Display
**Display-Only Button mit dynamischem Icon:**

- Zeigt aktuelle Geschwindigkeit (z.B. "45 km/h")
- Icon basiert auf **erlaubter Geschwindigkeit** (AllowedSpeed)
- Icons: speed_000.png bis speed_120.png (10er Schritte)
- Fragezeichen-Icon wenn keine Daten (speed_QUESTION.png)

**Features:**
- ✅ Live-Updates alle 300ms
- ✅ Automatische Icon-Auswahl basierend auf Tempolimit
- ✅ Kompakte Anzeige ohne "SPEED"-Text

### ⛽ Fuel Display
**Display-Only Button mit Live-Kraftstoff-Anzeige:**

- Zeigt Kraftstoff in Litern und Prozent
- ⚠️ Warnsymbol bei niedrigem Kraftstand
- Icon: sonderzeichen18.png

**Features:**
- ✅ Live-Updates alle 300ms
- ✅ Automatische Warnung bei LowFuelWarning

### ℹ️ Infos (Dropdown)
**Display-Only Button mit 3 Dropdown-Optionen:**

- **Window Heating** - Fensterheizung Status
- **Mirror Heating** - Spiegelheizung Status
- **Stop Request** - Haltewunsch Status

**Features:**
- ✅ Live-Updates alle 300ms
- ✅ Icons: Icon_Button_Off.png / Icon_Button_On.png
- ✅ Haltestelle-Icons: Haltestelle.png / Haltestelle_ON.png



### 🧹 Scheibenwischer
| Button | Beschreibung | Features |
|--------|--------------|----------|
| **Wiper Up** | Stufe erhöhen | Live Level-Anzeige |
| **Wiper Down** | Stufe verringern | Live Level-Anzeige |

**Anzeige:** `WIPER\n{Level}` (z.B. "WIPER\n2")

### 🪟 Fenster & Jalousien
**Dropdown-Button mit 6 Optionen:**

- **Driver Window Open** - Fahrerfenster öffnen (Icon: window-left-down.png)
- **Driver Window Close** - Fahrerfenster schließen (Icon: window-left-up.png)
- **Window Shade Up** - Jalousie hoch
- **Window Shade Down** - Jalousie runter
- **Window Shade Side Up** - Seitenjalousie hoch
- **Window Shade Side Down** - Seitenjalousie runter

**Features:**
- ✅ Dynamische Icons für Driver Window Open/Close
- ✅ Standard-Icon für alle anderen Optionen

### 🔌 Sonstiges
- **Pantograph On/Off** - Stromabnehmer (mit Status-LED: zeigt ob verbunden/getrennt)
- **Horn** - Hupe (gedrückt halten = kontinuierlich)
- **High Beam Flasher** - Lichthupe (gedrückt halten)
- **Camera Switch** - Kamera wechseln (mit view-next-camera Icon)
- **Wheelchair Request** - Rollstuhl-Anfrage
- **Cash Change** - Wechselgeld-System

### 💡 LED Monitor (Demo / LEDs)
**Dropdown-Button mit 63 LED-Optionen zur Überwachung:**

Zeigt den Status beliebiger Bus-LEDs in Echtzeit an.

**Kategorien:**
- **Dashboard LEDs (15)** - Brake Assist, Differential, Engine, Fixing Brake, Fog Light, Indicator, Lifting, Load Transfer, Retarder, Seatbelts, Turning, etc.
- **Door LEDs (12)** - Door 1-4 Status, Door Buttons, Door Clearance, External Door Lights
- **Lighting LEDs (15)** - Blinker, Headlight, Interior Light, Kneeling, Main Light, Warning, High Beam, etc.
- **Other LEDs (10)** - Camera Button, GPS, Door Requests, Door Locks, Stop Brake, etc.

**Features:**
- ✅ 63 verschiedene LEDs auswählbar
- ✅ Automatischer Icon-Wechsel: OFF = Icon_Button_Off.png, ON = Icon_Button_On.png
- ✅ Beschreibungen für jede LED (z.B. "Brake Assist (Bremsassistent)")
- ✅ Live-Updates alle 300ms
- ✅ Ideal zum Debuggen und Überwachen von Bus-Systemen

---

## 📝 Changelog

### Version 1.1.0 (27.11.2024) - Custom Edition

#### ✨ Neue Features

**Climate Control (komplett überarbeitet)**
- ✅ 10 Dropdown-Optionen: 7 Steuerungen + 3 Live-Displays
- ✅ Fan Speed, Driver Temp, AC Temp mit Live-Prozentanzeige
- ✅ ShowTemperature Checkbox zum Ein/Ausblenden der Werte
- ✅ Property Inspector mit korrektem JavaScript für persistente Auswahl
- ✅ State-Mapping für AC Temp (Primary/Secondary → 0%/50%)

**Kneeling/Lifting (erweitert)**
- ✅ 7 Dropdown-Optionen: 3 Toggle-Modi + 4 Direkt-Aktionen
- ✅ Toggle-Modi: Kneeling Toggle, Lifting Toggle, Lift Reset
- ✅ Direkt-Aktionen: Kneel Down/Up, Lift Up/Down
- ✅ Automatischer Icon-Wechsel (on/off)
- ✅ ShowStatus Checkbox für Status-Text

**Stop Request Button (neu)**
- ✅ Zeigt Haltewunsch-Status live an
- ✅ LED: DB Stop Request (aus AllLamps)
- ✅ Icons: Haltestelle.png / Haltestelle1_2.png
- ✅ Zeigt Tür-Nummer(n) bei Haltewunsch (z.B. "TÜR 2" oder "TÜR 2, 3")
- ✅ Nur Anzeige (kein Event beim Klicken)

**Wiper Buttons (verbessert)**
- ✅ Live WiperLevel-Anzeige auf beiden Buttons
- ✅ Text: "WIPER\n{Level}" (z.B. "WIPER\n2")
- ✅ Icons: wiper.png / wiper-c.png (Click-Feedback)
- ✅ Live-Updates alle 100ms

**Brake Buttons (gefixt)**
- ✅ Stop Brake: LED-Display mit korrektem Schwellenwert (>= 1.0)
- ✅ Fixing Brake: Umgestellt auf UpdateButtonIcon mit korrektem LED-Namen
- ✅ Icons wechseln jetzt korrekt zwischen OFF/ON
- ✅ LED-Namen korrigiert: "LED Stop Brake", "Dashboard Fixing Brake"

**High Beam Flasher (neu)**
- ✅ Separater Button für Lichthupe (hold-to-activate)
- ✅ Kontinuierliches Event-Senden alle 50ms beim Gedrückthalten
- ✅ LED: HeadLight Beam On
- ✅ Icons: passing.png / passing-c.png

**Horn (verbessert)**
- ✅ Hold-to-activate Funktionalität
- ✅ Kontinuierliches Hupen beim Gedrückthalten
- ✅ Icons: air-horn.png / air-horn-c.png

**Infos Button (neu)**
- ✅ Dropdown mit 3 Display-Only Optionen
- ✅ Window Heating, Mirror Heating, Stop Request
- ✅ Nur Status-Anzeige (keine Klick-Aktion)
- ✅ Live-Updates alle 100ms
- ✅ Property Inspector: infosinspector.html
- ✅ Icon: sonderzeichen18.png

**Fuel Display (neu)**
- ✅ Zeigt Kraftstoff in Litern, Prozent und Tankwarnung
- ✅ Berechnet Prozent aus CurrentFuel/MaxFuel
- ✅ ⚠️ Symbol bei LowFuelWarning
- ✅ Live-Updates alle 300ms
- ✅ Format: "FUEL\n123 L\n99%"
- ✅ Icon: sonderzeichen18.png

**Passengers (neu - 28.11.2024)**
- ✅ Dropdown-Button mit 7 Anzeige-Optionen:
  1. **Occupied Seats** - Belegte / Gesamt (Format: `0 / 36`)
  2. **Total Seats** - Nur Gesamt-Sitzplätze
  3. **Passenger Load** - Fahrgast-Last in %
  4. **Total Mass** - Gesamtmasse in kg
  5. **Doors Open** - Anzahl offener Türen
  6. **Passenger Doors** - Passagiertüren Status (OPEN/CLOSED)
  7. **Luggage Doors** - Gepäcktüren Status (OPEN/CLOSED)
- ✅ Property Inspector: passengersinspector.html
- ✅ Live-Updates alle 300ms
- ✅ Dropdown-Auswahl wird persistent gespeichert
- ✅ Icon: sonderzeichen18.png

**Engine Info (neu - 28.11.2024)**
- ✅ Dropdown-Button mit 8 Anzeige-Optionen:
  1. **Engine Status** - Motor läuft (RUNNING/OFF)
  2. **Ignition** - Zündung Status (ON/OFF)
  3. **RPM** - Drehzahl (Umdrehungen/min)
  4. **Engine Temperature** - Motortemperatur in %
  5. **Throttle** - Gaspedal-Position in %
  6. **Gearbox** - Aktueller Gang (D/N/R)
  7. **Brake** - Bremse in %
  8. **Cruise Control** - Tempomat Status (ACTIVE/OFF)
- ✅ Property Inspector: engineinspector.html
- ✅ Live-Updates alle 300ms
- ✅ Dropdown-Auswahl wird persistent gespeichert
- ✅ Icon: sonderzeichen18.png

**Speed Display (neu - 28.11.2024)**
- ✅ Display-Only Button mit dynamischem Icon
- ✅ Zeigt aktuelle Geschwindigkeit (z.B. "45 km/h")
- ✅ Icon basiert auf **erlaubter Geschwindigkeit** (AllowedSpeed)
- ✅ Icons: speed_000.png bis speed_120.png (10er Schritte)
- ✅ Fragezeichen-Icon wenn keine Daten (speed_QUESTION.png)
- ✅ Live-Updates alle 300ms

**Ignition Button (erweitert)**
- ✅ ShowStatus Checkbox zum Verstecken von Status-Text
- ✅ 3 Zustände: Motor AN, Zündung AN, AUS
- ✅ Separate Icons für jeden Status

#### 🐛 Bug-Fixes
- ✅ Climate Control Property Inspector: Auswahl bleibt jetzt persistent
- ✅ Kneeling/Lifting: Toggle-State wird korrekt gespeichert
- ✅ Door Lock Buttons: Namen korrigiert (LED-Namen waren vertauscht)
- ✅ Traveller Lights: LED-Name von "LightHeadlight" → "LightFlasher"
- ✅ Main Light: LED-Name korrigiert → "LightParking"
- ✅ Stop Brake: LED-Schwellenwert von > 0.0 → >= 1.0 (fix für 0.3 Standardwert)
- ✅ Fixing Brake: UpdateFixingBrakeStatus entfernt, nutzt jetzt UpdateButtonIcon
- ✅ LED-Icon-Pfade: Doppelte "actions/assets/" Präfixe behoben

#### 🔧 Technische Verbesserungen
- ✅ Global Variables: GlobalFanSpeed, GlobalDriverTemp, GlobalACTemp, GlobalStopRequest, GlobalWiperLevel
- ✅ Polling: Erweitert um WiperLevel, Climate-Werte aus Buttons-Array
- ✅ UpdateClimateDisplay: Neue Funktion für Live-Temperatur-Updates
- ✅ UpdateStopRequestStatus: Neue Funktion für Haltewunsch-LED
- ✅ UpdateWiperStatus: Neue Funktion für Wiper-Level-Anzeige
- ✅ UpdateIcon: LED-Schwellenwert von > 0.0 → >= 1.0 (global für alle LEDs)
- ✅ Property Inspector Scripts: Korrekte Event-Handler für persistente Settings

#### 📚 Dokumentation
- ✅ README.md mit vollständiger Feature-Liste
- ✅ Changelog mit allen Änderungen
- ✅ Installation und Konfiguration
- ✅ Button-Übersicht mit Beschreibungen

### Version 1.0.9 (Original)
- Basis-Version von TML Studios
- Standard-Buttons für Bus-Steuerung
- Grundlegende Türsteuerung
- Lichtsteuerung
- Getriebe-Auswahl

---

## 🔍 API Referenz

### Gepollt Variablen (alle 300ms)
```javascript
Buttons          // Button-Status (Fan Speed, Temperatures, etc.)
AllLamps         // LED-Status (Türen, Lichter, Stop Request, etc.)
IsPlayerControlled // Spieler hat Kontrolle
BusLogic         // Sales, Payment Status
EngineStarted    // Motor läuft (true/false)
IgnitionEnabled  // Zündung an (true/false)
WiperLevel       // Scheibenwischer-Stufe (0-4)
```

### Beispiel API-Call
```bash
GET http://127.0.0.1:37337/vehicles/BP_Solaris_Urbino_18m_4D_C_2147336351?vars=Buttons,AllLamps,WiperLevel
```

### Climate Control Werte
```javascript
Driver Fan Speed        // Value: 0.0 - 1.0
Driver Temperature      // Value: 0.0 - 1.0
Air Condition Temperature // State: Primary/Secondary
```

---

## 🛠️ Entwicklung

### Voraussetzungen
- **Stream Deck Software** (v5.0+)
- **Node.js** (für Entwicklung optional)
- **Text Editor** (VS Code empfohlen)

### Dateistruktur
```
de.tml-studios.telemetry.sdPlugin/
├── manifest.json              # Plugin-Definition
├── app.html                   # Entry Point
├── app.js                     # Hauptlogik (1900+ Zeilen)
├── actions/
│   ├── assets/               # Icons & Bilder
│   │   ├── Haltestelle.png
│   │   ├── wiper.png
│   │   ├── kneeling.png
│   │   └── ...
│   └── property-inspector/   # Settings UI
│       ├── climatecontrolinspector.html
│       ├── kneelingliftinspector.html
│       └── ...
└── libs/                     # Stream Deck SDK
```

### Wichtige Code-Abschnitte

**Climate Control (app.js, Zeile ~1680-1750)**
```javascript
ClimateControlAction.onKeyDown(...)  // Event-Handler
UpdateClimateDisplay(...)            // Live-Display-Funktion
```

**Wiper Status (app.js, Zeile ~1510-1545)**
```javascript
UpdateWiperStatus(...)               // Level-Anzeige
GlobalWiperLevel                     // Globale Variable
```

**Stop Request (app.js, Zeile ~1915-1935)**
```javascript
StopRequestAction.onWillAppear(...)  // Polling starten
UpdateStopRequestStatus(...)         // Status aktualisieren
```

### Eigene Buttons hinzufügen

1. **manifest.json** erweitern:
```json
{
  "Icon": "actions/assets/my-icon",
  "Name": "My Button",
  "UUID": "de.tml-studios.telemetry.mybutton",
  "PropertyInspectorPath": "actions/property-inspector/myinspector.html"
}
```

2. **app.js** - Action erstellen:
```javascript
const MyButtonAction = new Action('de.tml-studios.telemetry.mybutton');

MyButtonAction.onKeyDown(({ action, context, device, event, payload }) => {
    SendTelemetryAction("/sendevent?event=MyEvent");
});
```

3. **Icon** in `actions/assets/` speichern

---

## 🤝 Beitragen

Dieses Projekt ist eine **Custom-Version** für persönliche Anpassungen. Falls du Verbesserungen hast:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushe zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

---

## 📄 Lizenz

Basierend auf dem originalen TML Studios Plugin.
Custom Modifications: Eigene Anpassungen und Erweiterungen.

**Wichtig**: Dies ist eine **inoffizielle** Custom-Version. Für Support zum Original-Plugin wende dich an TML Studios.

---

## 🐛 Bekannte Probleme

- ⚠️ Stream Deck muss manchmal **neugestartet** werden nach Plugin-Updates
- ⚠️ Bei Speicherproblemen: Alte Plugin-Versionen aus `%APPDATA%\Elgato\StreamDeck\Plugins\` löschen
- ⚠️ Property Inspector: Bei Auswahl-Problemen Stream Deck **komplett schließen** und neu starten

---

## 💬 Support & Kontakt

**Original Plugin**: https://www.tml-studios.de/  
**Custom Version**: GitHub Issues verwenden  
**Bus Simulator Community**: [Discord/Forum Links hier]

---

## 🙏 Credits

- **TML Studios** - Original Plugin & API
- **Elgato** - Stream Deck SDK
- **Community** - Testing & Feedback

---

**Version**: 1.1.0 Custom  
**Letzte Aktualisierung**: 27.11.2025  
**Bus**: Solaris Urbino 18m 4D  

🚌 Happy Bus Driving! 🚌
