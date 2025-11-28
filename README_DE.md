# BlackMautz TML Telemetrie - Mercedes Stream Deck Plugin

Dieses Plugin nutzt die Telemetrie-Schnittstelle von TML-Studios' "The Bus" zur Steuerung von In-Game-Funktionen speziell für den **Mercedes-Benz eCitaro**.

Basierend auf dem Original TML Studios Telemetrie Plugin, angepasst von BlackMautz für Mercedes-Kompatibilität.

## Installation

### Schnellinstallation:
1. Lade die neueste `.streamDeckPlugin` Datei von [Releases](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/releases) herunter
2. Doppelklick auf die heruntergeladene Datei
3. Die Stream Deck Software installiert das Plugin automatisch

### Manuelle Installation (für Entwicklung):
1. Repository klonen
2. Kopiere `src/de.blackmautz.telemetry.mercedes.sdPlugin` nach:
   - **Windows**: `%APPDATA%\Elgato\StreamDeck\Plugins\`
   - **Mac**: `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`
3. Stream Deck Software neu starten

## Einrichtung

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

## Funktionen

### Mercedes-spezifische Erweiterungen:
- **Türverriegelung Links/Rechts** - Unabhängige Steuerung für linke und rechte Türverriegelung mit visuellem Statusfeedback
- **Türfreigabe** - Hintere Türfreigabe umschalten mit Statusanzeige
- **Auto Kneeling** - Automatisches Kneeling-System umschalten mit invertierter Boolean-Unterstützung
- **Türautomatik** - Automatisches Türschließen steuern
- **Lichtschalter** - Drehschalter-Steuerung (Aus/Standlicht/Abblendlicht/Fernlicht/Nebelscheinwerfer vorne/Nebelschlussleuchte)
  - Lichtschalter Links (nach links drehen - eine Stufe höher)
  - Lichtschalter Rechts (nach rechts drehen - eine Stufe runter)
  - Status-Anzeige

### API-Kompatibilität:
- Unterstützt sowohl Mercedes API (`/sendeventpress`, `/sendeventrelease`)
- Rückwärtskompatibel mit Solaris API (`/sendevent`)
- Handhabt gemischte Boolean- und zustandsbasierte Button-Systeme

### Funktionierende Features:
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

## Verwendungsbeispiele

### Türsteuerung:
- **Tür 1-4**: Einzelne Türen öffnen/schließen
- **Türverriegelung Links**: Alle linken Türen verriegeln (zeigt aktiven Status)
- **Türverriegelung Rechts**: Alle rechten Türen verriegeln (zeigt aktiven Status)
- **Türfreigabe**: Öffnungserlaubnis für hintere Türen aktivieren/deaktivieren

### Lichtschalter:
Erstelle 3 Buttons für volle Kontrolle:
- **Lichtschalter Links** - Schalter nach links drehen (höher: Aus → Standlicht → Abblendlicht → Fernlicht → Nebel)
- **Lichtschalter Rechts** - Schalter nach rechts drehen (runter)
- **Lichtschalter Status** - Aktuellen Lichtstatus anzeigen

### Kneeling-System:
- **Auto Kneeling**: Automatisches Kneeling an Haltestellen umschalten
- **Kneeling Umschalten**: Manuelle Kneeling-Steuerung
- **Heben/Senken**: Plattform-Lift-Steuerung

## Bekannte Probleme & Besonderheiten

### Mercedes API-Unterschiede:
- **Invertierte Boolean-Logik**: Einige Buttons (z.B. Auto Kneeling) verwenden invertierte Logik, wobei `false` = AN
- **Unterschiedliche Event-Namen**: Mercedes verwendet andere Event-Namen als Solaris
  - Türautomatik: `ToggleAutomaticRearDoorClosing`
  - Auto Kneeling: `Pedestrians`
  - Türfreigabe: `ToggleDoorClearance`
- **Button-Light-Namen**: Verwendet `ButtonLight <Name>` Format statt `<Name> Light`

## Versions-Historie

**v1.0.1** (Aktuell)
- Lichtschalter-Steuerung hinzugefügt
- Auto-Kneeling-Icon-Updates behoben
- Türautomatik und Türfreigabe behoben
- Vollständige Mercedes API-Kompatibilität

**v1.0.0**
- Erste Mercedes eCitaro Veröffentlichung
- Türverriegelung Links/Rechts Funktionalität
- Basis Mercedes API-Unterstützung

## Credits

- **Original Plugin**: TML Studios
- **Mercedes-Anpassung**: BlackMautz
- **Repository**: [BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes)

## Support

Für Probleme, Vorschläge oder Fragen:
- Öffne ein Issue auf [GitHub](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/issues)
- Tritt dem [TML Studios Discord](https://discord.gg/tml-studios-224563159631921152) bei
