# Changelog - BlackMautz TML Telemetry Mercedes Plugin

## Änderungen von Solaris zu Mercedes

### Neue Features (nur in Mercedes)

#### 1. Light Switch Control (Lichtschalter-Steuerung)
- **Dateien geändert:**
  - `app.js`: Zeilen 2773-2850 (ca. 77 Zeilen neu)
  - `manifest.json`: Light Switch Action hinzugefügt
  - `actions/property-inspector/lightswitchinspector.html`: Neues Property Inspector HTML
- **Funktionalität:**
  - 3 Modi: Links/Rechts/Status
  - Dynamische Icons basierend auf Position
  - 6 Lichtstufen: Off, Parking, Headlights, High Beam, Front Fog, Rear Fog
  - Zeigt vorherige/aktuelle/nächste Position visuell
- **API:** `/sendeventpress?event=LightSwitchUp` und `LightSwitchDown`

#### 2. Door Lock Left/Right (Türverriegelung Links/Rechts)
- **Dateien geändert:**
  - `app.js`: Door Lock Left/Right Actions
  - `manifest.json`: Zwei separate Door Lock Actions
- **Funktionalität:**
  - Separate Steuerung für linke und rechte Türen
  - Visuelles Feedback (Icon wechselt bei Aktivierung)
- **API:** `/sendeventpress?event=DoorLockLeft` / `DoorLockRight`

#### 3. Door Clearance (Türfreigabe)
- **Dateien geändert:**
  - `app.js`: Door Clearance Action Handler
  - `manifest.json`: Door Clearance Action
- **Funktionalität:**
  - Hintere Türfreigabe umschalten
  - Statusanzeige
- **API:** `/sendeventpress?event=ToggleDoorClearance`

#### 4. Auto Kneeling Fix
- **Dateien geändert:**
  - `app.js`: Auto Kneeling mit invertierter Boolean-Logik
- **Funktionalität:**
  - Mercedes verwendet invertierte Logik: `false` = AN
  - Icon-Updates korrigiert
- **API:** `/sendeventpress?event=Pedestrians`

#### 5. Door Autoclose (Türautomatik)
- **Dateien geändert:**
  - `app.js`: Door Autoclose Handler
- **Funktionalität:**
  - Automatisches Türschließen aktivieren/deaktivieren
- **API:** `/sendeventpress?event=ToggleAutomaticRearDoorClosing`

#### 6. High Beam Flasher (Lichthupe)
- **Dateien geändert:**
  - `app.js`: Zeilen ~2775-2810 (ca. 35 Zeilen neu)
  - Variable `HighBeamInterval` hinzugefügt
- **Funktionalität:**
  - Kontinuierliches Senden während Button gedrückt (alle 50ms)
  - Automatisches Release beim Loslassen
- **API:** `/sendeventpress?event=HighBeamFlasher` + `/sendeventrelease`

### API-Unterschiede Solaris vs Mercedes

#### Solaris API:
```javascript
/sendevent?event=EventName
```

#### Mercedes API:
```javascript
/sendeventpress?event=EventName
/sendeventrelease?event=EventName
```

### Event-Namen Unterschiede

| Funktion | Solaris | Mercedes |
|----------|---------|----------|
| Türverriegelung Links | "Door Lock Left" | "DoorLockLeft" |
| Türverriegelung Rechts | "Door Lock Right" | "DoorLockRight" |
| Türfreigabe | - (existiert nicht) | "ToggleDoorClearance" |
| Auto Kneeling | "Auto Kneeling" | "Pedestrians" |
| Türautomatik | - (existiert nicht) | "ToggleAutomaticRearDoorClosing" |
| Lichthupe | "High Beam Flasher On" | "HighBeamFlasher" |
| Button Light Namen | "<Name> Light" | "ButtonLight <Name>" |

### Code-Statistiken

**Neue Zeilen Code:**
- `app.js`: ~200-250 Zeilen neu/geändert
- Neue Property Inspectors: 1 (lightswitchinspector.html)
- Manifest Änderungen: ~15 neue/geänderte Actions

**Neue Dateien:**
- `actions/property-inspector/lightswitchinspector.html`
- `CHANGELOG.md` (diese Datei)
- `README.md` (komplett überarbeitet, zweisprachig DE/EN)

### Besondere Anpassungen

1. **Invertierte Boolean-Logik:**
   - Einige Mercedes-Buttons verwenden `false` = AN statt `true` = AN
   - Betrifft: Auto Kneeling

2. **Icon-System:**
   - Light Switch verwendet spezifische Icons pro Position:
     - `side-markers.png` / `side-markers-c.png` (Off/Parking)
     - `low-beam-c.png` (Headlights)
     - `passing-c.png` (High Beam)
     - `fog-lamp-rear-c.png` (Front Fog)
     - `fog-lamp-front-c.png` (Rear Fog)

3. **Kontinuierliches Senden:**
   - High Beam Flasher sendet alle 50ms während Button gedrückt
   - Verwendet `setInterval` für kontinuierliches Senden

### Kompatibilitäts-Status

**Funktionierende Features (Mercedes):**
- ✅ Wechselgeldsystem
- ✅ Türsteuerung (mit Türfreigabe, Verriegelung links/rechts)
- ✅ Gangwahl
- ✅ Zündung
- ✅ Feststellbremse (FixingBrake + FixingBrakeToggle mit Icon-Updates)
- ✅ Benutzerdefinierte Aktionen
- ✅ Ticket-Verkaufsstatus
- ✅ Bus-Startoptionen (Schnellstart)
- ✅ Blinker / Warnblinkanlage
- ✅ Benutzerdefinierte Buttons
- ✅ Lichtschalter-Steuerung (Light Switch mit 3 Modi)
- ✅ Auto-Kneeling-System
- ✅ Automatisches Türschließen
- ✅ Stop Request (Haltewunsch-Anzeige mit Türnummern)

**Nicht getestet/Möglicherweise nicht kompatibel:**
- ❓ Climate Control
- ❓ Window Control
- ❓ Kneeling/Lift Control
- ❓ Pantograph (falls nicht vorhanden in Mercedes)

---

## Versionshistorie

### v1.0.1 (2025-11-28)
- Lichtschalter-Steuerung mit dynamischen Icons hinzugefügt
- Dropdown-Labels für Light Switch korrigiert (Rechts/Links Orientierung)
- Auto-Kneeling-Icon-Updates behoben
- Türautomatik und Türfreigabe behoben
- High Beam Flasher (Lichthupe) implementiert (nur Solaris - Mercedes nicht benötigt)
- **Fixing Brake (Feststellbremse) vollständig funktional:**
  - API-Name identifiziert: "ParkingBrake" (nicht "Dashboard Fixing Brake")
  - Manifest mit 2 States aktualisiert (Off: Feststellbremse_Vers2.png, On: Feststellbremse_Ver2_1.png)
  - UpdateButtonState statt UpdateButtonIcon verwendet (ParkingBrake ist Button, kein LED)
  - Icon-Reihenfolge korrigiert (Off/On waren vertauscht)
  - Beide Buttons funktional: FixingBrake und FixingBrakeToggle
- **Stop Request (Haltewunsch) implementiert:**
  - API-Name identifiziert: "LED StopRequest" (nicht "DB Stop Request")
  - UpdateStopRequestStatus Funktion hinzugefügt
  - Zeigt aktive Haltewünsche mit Türnummern (TÜR 2, 3, 4)
  - Icons: Haltestelle.png (inaktiv), Haltestelle1_2.png (aktiv)
- API-First Methodik etabliert: Immer /vehicles/current abfragen für korrekte Namen
- Vollständige Mercedes API-Kompatibilität
- README zweisprachig (DE/EN) in einer Datei
- Repository-Struktur korrigiert

### v1.0.0 (Initial Release)
- Erste Mercedes eCitaro Veröffentlichung
- Basis Solaris Plugin als Grundlage
- Türverriegelung Links/Rechts Funktionalität
- Basis Mercedes API-Unterstützung

---

## Zusammenfassung für Universal-Plugin Entwicklung

**Was muss zusammengeführt werden:**
1. Auto-Detection des Bustyps (über Vehicle-Property oder User-Auswahl)
2. Bedingte API-Aufrufe basierend auf Bustyp
3. Event-Namen-Mapping für beide Systeme
4. Boolean-Logik-Anpassung (invertiert für Mercedes bei bestimmten Buttons)
5. Gemeinsame Icon-Verwaltung

**Geschätzte Arbeit:**
- ~300-400 Zeilen Code für Universal-Wrapper
- Auto-Detection-Logik: ~50 Zeilen
- Event-Mapping-System: ~100 Zeilen
- Bedingte Handler: ~150-200 Zeilen
- Testing beider Systeme erforderlich
