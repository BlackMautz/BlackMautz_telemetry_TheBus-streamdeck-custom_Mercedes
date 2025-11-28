# BlackMautz TML Telemetrie - Mercedes Stream Deck Plugin

## 🇩🇪 Deutsch

Dieses Plugin nutzt die Telemetrie-Schnittstelle von TML-Studios' "The Bus" zur Steuerung von In-Game-Funktionen speziell für den **Mercedes-Benz eCitaro**.

Basierend auf dem Original TML Studios Telemetrie Plugin, angepasst von BlackMautz für Mercedes-Kompatibilität.

### Installation

#### Schnellinstallation:
1. Lade die neueste `.streamDeckPlugin` Datei von [Releases](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/releases) herunter
2. Doppelklick auf die heruntergeladene Datei
3. Die Stream Deck Software installiert das Plugin automatisch

#### Manuelle Installation (für Entwicklung):
1. Repository klonen
2. Kopiere `src/de.blackmautz.telemetry.mercedes.sdPlugin` nach:
   - **Windows**: `%APPDATA%\Elgato\StreamDeck\Plugins\`
   - **Mac**: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`
3. Stream Deck Software neu starten

### Einrichtung

1. **Telemetrie in The Bus aktivieren:**
   - Starte "The Bus"
   - Gehe zu Einstellungen → Aktiviere "Telemetrie-Schnittstelle"
   - Starte das Spiel neu

2. **Stream Deck konfigurieren:**
   - Füge eine Aktion aus der Kategorie "BlackMautz TML Telemetry - Mercedes" hinzu
   - In den Aktionseinstellungen konfigurieren:
     - **Ziel-IP**: `127.0.0.1` (verwende die IP des Spiele-PCs bei Remote-Verbindung)
     - **Ziel-Port**: `37337` (Standard)

3. **Verbindung testen:**
   - Füge einen "Connection Status" Button hinzu zur Verbindungsprüfung
   - Grün = Verbunden, Rot = Getrennt

### Funktionen

#### Mercedes-spezifische Erweiterungen:
- **Türverriegelung Links/Rechts** - Unabhängige Steuerung für linke und rechte Türverriegelung mit visuellem Statusfeedback
- **Türfreigabe** - Hintere Türfreigabe umschalten mit Statusanzeige
- **Auto Kneeling** - Automatisches Kneeling-System umschalten mit invertierter Boolean-Unterstützung
- **Türautomatik** - Automatisches Türschließen steuern
- **Lichtschalter** - Drehschalter-Steuerung (Aus/Standlicht/Abblendlicht/Fernlicht/Nebelscheinwerfer vorne/Nebelschlussleuchte)
  - Schalter nach Rechts (eine Stufe höher)
  - Schalter nach Links (eine Stufe runter)
  - Status-Anzeige mit 3 Positionen (vorherige/aktuelle/nächste)
- **Feststellbremse (Fixing Brake)** - Parkbremse mit Icon-Status (zeigt AN/AUS visuell)
- **Haltewunsch (Stop Request)** - Zeigt aktive Haltewünsche mit Türnummern an
- **Haltestellenbremse (Stop Brake)** - Haltestellen-Parkbremse mit 2-State Icon-Wechsel
- **Innenbeleuchtung Gedimmt** - Schaltet zwischen Normal (Aus) und Gedimmt (30%) mit selbstzentrierendem Schalter
- **Innenbeleuchtung Hell** - Schaltet zwischen Normal (Aus) und Hell (100%) mit selbstzentrierendem Schalter

#### API-Kompatibilität:
- Unterstützt sowohl Mercedes API (`/sendeventpress`, `/sendeventrelease`)
- Rückwärtskompatibel mit Solaris API (`/sendevent`)
- Handhabt gemischte Boolean- und zustandsbasierte Button-Systeme

#### Funktionierende Features:
- [x] Wechselgeldsystem
- [x] Türsteuerung (mit Türfreigabe, Verriegelung links/rechts)
- [x] Gangwahl
- [x] Zündung
- [x] Feststellbremse
- [x] Benutzerdefinierte Aktionen
- [x] Ticket-Verkaufsstatus
- [x] Bus-Startoptionen (Schnellstart)
- [x] Blinker / Warnblinkanlage
- [x] Benutzerdefinierte Buttons (mit benutzerdefinierten Feedback-Optionen)
- [x] Lichtschalter-Steuerung (Drehschalter-Simulation)
- [x] Auto-Kneeling-System
- [x] Automatisches Türschließen

### Verwendungsbeispiele

#### Türsteuerung:
- **Tür 1-4**: Einzelne Türen öffnen/schließen
- **Türverriegelung Links**: Alle linken Türen verriegeln (zeigt aktiven Status)
- **Türverriegelung Rechts**: Alle rechten Türen verriegeln (zeigt aktiven Status)
- **Türfreigabe**: Öffnungserlaubnis für hintere Türen aktivieren/deaktivieren

#### Lichtschalter:
Erstelle 3 Buttons für volle Kontrolle - wie ein echter Drehschalter:
- **Lichtschalter Links** - Zeigt die nächste Position (wohin der Schalter geht wenn du nach links drehst)
- **Lichtschalter Status** - Zeigt die aktuelle Schalterposition
- **Lichtschalter Rechts** - Zeigt die vorherige Position (wohin der Schalter geht wenn du nach rechts drehst)

Die Icons ändern sich je nach Position:
- Off → Parking Lights → Headlights → High Beam → Front Fog → Rear Fog
- Jeder Button zeigt visuell die Position an, die beim Drücken aktiviert wird

#### Kneeling-System:
- **Auto Kneeling**: Automatisches Kneeling an Haltestellen umschalten
- **Kneeling Umschalten**: Manuelle Kneeling-Steuerung
- **Heben/Senken**: Plattform-Lift-Steuerung

### Bekannte Probleme & Besonderheiten

#### Mercedes API-Unterschiede:
- **Invertierte Boolean-Logik**: Einige Buttons (z.B. Auto Kneeling) verwenden invertierte Logik, wobei `false` = AN
- **Unterschiedliche Event-Namen**: Mercedes verwendet andere Event-Namen als Solaris
  - Türautomatik: `ToggleAutomaticRearDoorClosing`
  - Auto Kneeling: `Pedestrians`
  - Türfreigabe: `ToggleDoorClearance`
- **Button-Light-Namen**: Verwendet `ButtonLight <Name>` Format statt `<Name> Light`

### Versions-Historie

**v1.0.2** (Aktuell)
- Haltestellenbremse (Stop Brake) hinzugefügt mit 2-State Icon-Wechsel
- Innenbeleuchtung Gedimmt/Hell Toggle-Buttons hinzugefügt
- Alle fehlenden Icons aus Solaris Plugin importiert
- Icon-Updates für Kneeling/Lifting, Climate Control, Window Control, Wiper, USB Clearance, Wheelchair Request
- Light Control Icons für Driver Light und Interior Light Optionen korrigiert
- Selbstzentrierender Schalter-Support für Innenbeleuchtung (Event-Namen sind vertauscht: InteriorLightBright = Dim, InteriorLightDim = Bright)

**v1.0.1**
- Lichtschalter-Steuerung hinzugefügt mit dynamischen Icons (zeigt vorherige/aktuelle/nächste Position)
- Auto-Kneeling-Icon-Updates behoben
- Türautomatik und Türfreigabe behoben
- Vollständige Mercedes API-Kompatibilität

**v1.0.0**
- Erste Mercedes eCitaro Veröffentlichung
- Türverriegelung Links/Rechts Funktionalität
- Basis Mercedes API-Unterstützung

---

## 🇬🇧 English

This plugin uses the telemetry interface of TML-Studios' "The Bus" to control in-game functions specifically for the **Mercedes-Benz eCitaro**.

Based on the original TML Studios Telemetry Plugin, customized by BlackMautz for Mercedes compatibility.

### Installation

#### Quick Install:
1. Download the latest `.streamDeckPlugin` file from [Releases](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/releases)
2. Double-click the downloaded file
3. Stream Deck software will install it automatically

#### Manual Install (for development):
1. Clone this repository
2. Copy `src/de.blackmautz.telemetry.mercedes.sdPlugin` to:
   - **Windows**: `%APPDATA%\Elgato\StreamDeck\Plugins\`
   - **Mac**: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`
3. Restart Stream Deck software

### Setup

1. **Enable Telemetry in The Bus:**
   - Launch "The Bus"
   - Go to Settings → Enable "Telemetry Interface"
   - Restart the game

2. **Configure Stream Deck:**
   - Add any action from "BlackMautz TML Telemetry - Mercedes" category
   - In the action settings, configure:
     - **Target IP**: `127.0.0.1` (use game PC's IP if running remotely)
     - **Target Port**: `37337` (default)

3. **Test Connection:**
   - Add a "Connection Status" button to verify connection
   - Green = Connected, Red = Disconnected

### Features

#### Mercedes-Specific Enhancements:
- **Door Lock Left/Right** - Independent control for left and right door locking with visual status feedback
- **Door Clearance** - Toggle rear door clearance with status indication
- **Auto Kneeling** - Automatic kneeling system toggle with inverted boolean support
- **Door Autoclose** - Automatic door closing control
- **Light Switch** - Rotary light switch control (Off/Parking/Headlights/High Beam/Fog Front/Fog Rear)
  - Switch Right (increase - one step up)
  - Switch Left (decrease - one step down)
  - Status Display with 3 positions (previous/current/next)
- **Fixing Brake (Parking Brake)** - Parking brake with icon status (shows ON/OFF visually)
- **Stop Request** - Displays active stop requests with door numbers

#### API Compatibility:
- Supports both Mercedes API (`/sendeventpress`, `/sendeventrelease`)
- Backward compatible with Solaris API (`/sendevent`)
- Handles mixed boolean and state-based button systems

#### Working Features:
- [x] Cash Change System
- [x] Door Control (with door clearance, lock left/right)
- [x] Gear Switch
- [x] Ignition
- [x] Fixing Brake (with icon status updates)
- [x] Custom Actions
- [x] Ticket Sale Status
- [x] Bus Start Options (Quick Start)
- [x] Indicators / Warning Light Button
- [x] Custom Button (with custom feedback options)
- [x] Light Switch Control (Rotary switch simulation)
- [x] Auto Kneeling System
- [x] Automatic Door Closing
- [x] Stop Request Display (with door numbers)

### Usage Examples

#### Door Control:
- **Door 1-4**: Open/close individual doors
- **Door Lock Left**: Lock all left-side doors (shows active status)
- **Door Lock Right**: Lock all right-side doors (shows active status)
- **Door Clearance**: Enable/disable rear door opening permission

#### Light Switch:
Create 3 buttons for full control - like a real rotary switch:
- **Light Switch Left** - Shows the next position (where the switch goes when you rotate left)
- **Light Switch Status** - Shows the current switch position
- **Light Switch Right** - Shows the previous position (where the switch goes when you rotate right)

Icons change based on position:
- Off → Parking Lights → Headlights → High Beam → Front Fog → Rear Fog
- Each button visually shows the position that will be activated when pressed

#### Kneeling System:
- **Auto Kneeling**: Toggle automatic kneeling at stops
- **Kneeling Toggle**: Manual kneeling control
- **Lift Up/Down**: Platform lift control

### Known Issues & Quirks

#### Mercedes API Differences:
- **Inverted Boolean Logic**: Some buttons (e.g., Auto Kneeling) use inverted logic where `false` = ON
- **Different Event Names**: Mercedes uses different event names than Solaris
  - Door Autoclose: `ToggleAutomaticRearDoorClosing`
  - Auto Kneeling: `Pedestrians`
  - Door Clearance: `ToggleDoorClearance`
- **Button Light Names**: Uses `ButtonLight <Name>` format instead of `<Name> Light`

### Version History

**v1.0.1** (Current)
- Added Light Switch control with dynamic icons (shows previous/current/next position)
- Fixed Auto Kneeling icon updates
- Fixed Door Autoclose and Door Clearance
- Complete Mercedes API compatibility

**v1.0.0**
- Initial Mercedes eCitaro release
- Door Lock Left/Right functionality
- Basic Mercedes API support

---

## Credits

- **Original Plugin**: TML Studios
- **Mercedes Customization**: BlackMautz
- **Repository**: [BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes)

## Support

For issues, suggestions, or questions:
- Open an issue on [GitHub](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/issues)
- Join the [TML Studios Discord](https://discord.gg/tml-studios-224563159631921152)
