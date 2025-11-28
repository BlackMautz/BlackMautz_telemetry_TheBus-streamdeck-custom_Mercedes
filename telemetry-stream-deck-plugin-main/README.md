# BlackMautz TML Telemetry - Mercedes Stream Deck Plugin

This plugin uses the telemetry interface of TML-Studios' "The Bus" to control in-game functions specifically for the **Mercedes-Benz eCitaro**.

Based on the original TML Studios Telemetry Plugin, customized by BlackMautz for Mercedes compatibility.

## Features

### Mercedes-Specific Enhancements:
- **Door Lock Left/Right** - Independent control for left and right door locking with visual status feedback
- **Door Clearance** - Toggle rear door clearance with status indication
- **Auto Kneeling** - Automatic kneeling system toggle with inverted boolean support
- **Door Autoclose** - Automatic door closing control
- **Light Switch** - Rotary light switch control (Off/Parking/Headlights/High Beam/Fog Front/Fog Rear)
  - Light Switch Left (rotate left - increase)
  - Light Switch Right (rotate right - decrease)
  - Status Display

### API Compatibility:
- Supports both Mercedes API (`/sendeventpress`, `/sendeventrelease`)
- Backward compatible with Solaris API (`/sendevent`)
- Handles mixed boolean and state-based button systems

### Working Features:
- [x] Cash Change System
- [x] Door Control (with door clearance, lock left/right)
- [x] Gear Switch
- [x] Ignition
- [x] Fixing Brake
- [x] Custom Actions
- [x] Ticket Sale Status
- [x] Bus Start Options (Quick Start)
- [x] Indicators / Warning Light Button
- [x] Custom Button (with custom feedback options)
- [x] Light Switch Control (Rotary switch simulation)
- [x] Auto Kneeling System
- [x] Automatic Door Closing

## Installation

1. Download the latest release from the [Releases](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/releases) page
2. Double-click the `.streamDeckPlugin` file
3. Stream Deck software will install it automatically

## Configuration

1. Enable Telemetry in The Bus settings and restart the game
2. Add actions to your Stream Deck layout
3. Configure connection settings:
   - **Target IP**: 127.0.0.1 (default, use game PC's IP if remote)
   - **Target Port**: 37337 (default)

## Known Issues & Quirks

### Mercedes API Differences:
- **Inverted Boolean Logic**: Some buttons (e.g., Auto Kneeling) use inverted logic where `false` = ON
- **Different Event Names**: Mercedes uses different event names than Solaris
  - Door Autoclose: `ToggleAutomaticRearDoorClosing`
  - Auto Kneeling: `Pedestrians`
  - Door Clearance: `ToggleDoorClearance`
- **Button Light Names**: Uses `ButtonLight <Name>` format instead of `<Name> Light`

## Version History

**v1.0.1** (Current)
- Added Light Switch control (rotary simulation)
- Fixed Auto Kneeling icon updates
- Fixed Door Autoclose and Door Clearance
- Complete Mercedes API compatibility

**v1.0.0**
- Initial Mercedes eCitaro release
- Door Lock Left/Right functionality
- Basic Mercedes API support

## Credits

- **Original Plugin**: TML Studios
- **Mercedes Customization**: BlackMautz
- **Repository**: [BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes)

## Support

For issues, suggestions, or questions:
- Open an issue on [GitHub](https://github.com/BlackMautz/BlackMautz_telemetry_TheBus-streamdeck-custom_Mercedes/issues)
- Join the [TML Studios Discord](https://discord.gg/tml-studios-224563159631921152)
