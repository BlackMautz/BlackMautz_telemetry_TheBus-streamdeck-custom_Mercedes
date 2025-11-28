/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const DoorAction = new Action('de.blackmautz.telemetry.mercedes.dooraction');
const CashAction = new Action('de.blackmautz.telemetry.mercedes.changeaction');
const GearSwitchAction = new Action('de.blackmautz.telemetry.mercedes.gearselect');
const IgnitionAction = new Action("de.blackmautz.telemetry.mercedes.ignition");
const FixingBrakeAction = new Action("de.blackmautz.telemetry.mercedes.fixingbrake");
const CustomAction = new Action('de.blackmautz.telemetry.mercedes.customaction');
const SaleStatus = new Action('de.blackmautz.telemetry.mercedes.paymentstatus');
const StartOptionAction = new Action('de.blackmautz.telemetry.mercedes.start');
const ConnectionStatus = new Action('de.blackmautz.telemetry.mercedes.constatus');
const IndicatorControl = new Action('de.blackmautz.telemetry.mercedes.indicatorcontrol');
const CustomButtonAction = new Action('de.blackmautz.telemetry.mercedes.custombutton');
const LightControlAction = new Action('de.blackmautz.telemetry.mercedes.lightcontrol');
const LightSwitchAction = new Action('de.blackmautz.telemetry.mercedes.lightswitchv2');
const WiperUpAction = new Action('de.blackmautz.telemetry.mercedes.wiperup');
const WiperDownAction = new Action('de.blackmautz.telemetry.mercedes.wiperdown');
const HornAction = new Action('de.blackmautz.telemetry.mercedes.horn');
const HighBeamFlasherAction = new Action('de.blackmautz.telemetry.mercedes.highbeamflasher');
const WindowHeatingAction = new Action('de.blackmautz.telemetry.mercedes.windowheating');
const MirrorHeatingAction = new Action('de.blackmautz.telemetry.mercedes.mirrorheating');
const InfosAction = new Action('de.blackmautz.telemetry.mercedes.infos');
const FuelAction = new Action('de.blackmautz.telemetry.mercedes.fuel');
const PassengersAction = new Action('de.blackmautz.telemetry.mercedes.passengers');
const EngineInfoAction = new Action('de.blackmautz.telemetry.mercedes.engineinfo');
const SpeedDisplayAction = new Action('de.blackmautz.telemetry.mercedes.speeddisplay');
const FixingBrakeToggleAction = new Action('de.blackmautz.telemetry.mercedes.fixingbraketoggle');
const StopBrakeAction = new Action('de.blackmautz.telemetry.mercedes.stopbrake');
const KneelingLiftAction = new Action('de.blackmautz.telemetry.mercedes.kneelinglift');
const ClimateControlAction = new Action('de.blackmautz.telemetry.mercedes.climatecontrol');
const WindowControlAction = new Action('de.blackmautz.telemetry.mercedes.windowcontrol');
const PantographOnAction = new Action('de.blackmautz.telemetry.mercedes.pantographon');
const PantographOffAction = new Action('de.blackmautz.telemetry.mercedes.pantographoff');
const CameraSwitchAction = new Action('de.blackmautz.telemetry.mercedes.cameraswitch');
const USBClearanceAction = new Action('de.blackmautz.telemetry.mercedes.usbclearance');
const WheelchairRequestAction = new Action('de.blackmautz.telemetry.mercedes.wheelchairrequest');
const StopRequestAction = new Action('de.blackmautz.telemetry.mercedes.stoprequest');
const LEDMonitorAction = new Action('de.blackmautz.telemetry.mercedes.ledmonitor');

var GlobalTargetAddress = null
var GlobalTargetPort = null
var LastSendCommand = null

var GlobalIconUpdateData = [];
var GlobalInterval = [];
var GlobalLampData = [];
var GlobalButtonData = [];
var GlobalCurrentState = [];
var GlobalPaymentStatus = null;
var GlobalCurrentGear = "";
var CurrentVehicle = null;
var GlobalEngineStarted = false;
var GlobalIgnitionEnabled = false;
var GlobalFanSpeed = 0;
var GlobalDriverTemp = 0;
var GlobalACTemp = 0;
var GlobalStopRequest = false;
var GlobalSecondDoorRequest = false;
var GlobalThirdDoorRequest = false;
var GlobalFourthDoorRequest = false;
var GlobalWiperLevel = 0;
var GlobalCurrentFuel = 0.0;
var GlobalMaxFuel = 0.0;
var GlobalLowFuelWarning = false;
var GlobalNumSeats = 0;
var GlobalNumOccupiedSeats = 0;
var GlobalLoad = 0.0;
var GlobalMass = 0.0;
var GlobalDoorsOpen = 0;
var GlobalPassengerDoorsOpen = false;
var GlobalLuggageDoorsOpen = false;
var GlobalRPM = 0.0;
var GlobalMaxRPM = 11000.0;
var GlobalEngineTemperature = 0.0;
var GlobalThrottle = 0.0;
var GlobalSpeed = 0.0;
var GlobalAllowedSpeed = 0.0;
var GlobalCruiseControlActive = false;
var GlobalGearbox = "";
var GlobalBrake = 0.0;

// Store settings per context for dropdown buttons
var ButtonSettings = {};

var SaleStatusRegister = {};
var StartOptions = {};
var failedConnectionCounter = 10;



// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Global Functions

async function fetchWithTimeout(resource, options = {}) {
	const { timeout = 8000 } = options;
	
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);
  
	try
	{
		const response = await fetch(resource, {
	  	...options,
	  	signal: controller.signal  
		});
	clearTimeout(id);
	failedConnectionCounter = 0;
	return response;
	}
	catch (e)
	{
		failedConnectionCounter += 1
		if(failedConnectionCounter > 20)
			failedConnectionCounter = 20;
	}
}

async function CheckCurrentVehicle()
{

	if(GlobalTargetAddress == null || GlobalTargetPort == null)
		{
			GlobalSettings = $SD.getGlobalSettings();
			return;
		}

	var aviableVehicles = 0;
	try
	{
		TargetUrl = "http://" + GlobalTargetAddress + ":" + GlobalTargetPort + "/vehicles"
		await fetchWithTimeout(TargetUrl, {timeout: 200})
		.then(data => {return data.json()})
		.then(data => {
			aviableVehicles = data.length;
		});
	}
	catch (error)
	{
	}

	if(aviableVehicles < 1)
	{
		CurrentVehicle = null;
		return;
	}

	try
	{
		if(GlobalTargetAddress == null || GlobalTargetPort == null)
		{
			GlobalSettings = $SD.getGlobalSettings();
		}
		else
		{
			TargetUrl = "http://" + GlobalTargetAddress + ":" + GlobalTargetPort + "/player"
			fetchWithTimeout(TargetUrl, {timeout: 200})
			.then(data => {
				if(data.text == "Not in Bus")
				{
					return null;
				}
				return data.json()
			}).then(data => {
				if(data.Mode != "Vehicle")
				{
					CurrentVehicle =null;
				}
				else
				{
					CurrentVehicle = data.CurrentVehicle;
				}
			})
		}
	}
	catch (error)
	{
		console.log("Get CurrentVehicle Failed:" + error);
		ConnectionFailed();
	}
}

function SendTelemetryCommand(SendTelemetryCommand)
{
	try
	{
		if(GlobalTargetAddress == null || GlobalTargetPort == null)
		{
			GlobalSettings = $SD.getGlobalSettings();
		}
		else
		{
			TargetUrl = "http://" + GlobalTargetAddress + ":" + GlobalTargetPort + "/Command?Command=" + SendTelemetryCommand;
			fetchWithTimeout(TargetUrl, {timeout: 200});
			console.log(TargetUrl);
		}
	}
	catch (error)
	{
		console.log("Send Command Failed:" + error);
		ConnectionFailed();
	}	
}

function SendTelemetryAction(SendTelemetryCommand)
{
	try
	{
		LastSendCommand = SendTelemetryCommand
	
		if(CurrentVehicle == null)
		{
			return;
		}
	
		if(GlobalTargetAddress == null || GlobalTargetPort == null)
		{
			GlobalSettings = $SD.getGlobalSettings();
		}
		else
		{
			TargetUrl = "http://" + GlobalTargetAddress + ":" + GlobalTargetPort + "/vehicles/" + CurrentVehicle + SendTelemetryCommand
			fetchWithTimeout(TargetUrl, {timeout: 200});
			console.log(TargetUrl)
			LastSendCommand = null
		}
	}
	catch (error)
	{
		console.log("Send Action Failed:" + error);
		ConnectionFailed();
	}
}

function UpdateTelemetryData()
{
	try
	{
		if(CurrentVehicle == null)
		{
			CheckCurrentVehicle();
			return;
		}
		if(GlobalTargetAddress == null || GlobalTargetPort == null)
		{
			GlobalSettings = $SD.getGlobalSettings();
		}
		else
		{
			TargetUrl = "http://" + GlobalTargetAddress + ":" + GlobalTargetPort + "/vehicles/" + CurrentVehicle + "?vars=Buttons,AllLamps,IsPlayerControlled,BusLogic,EngineStarted,IgnitionEnabled,WiperLevel,CurrentFuel,MaxFuel,LowFuelWarning,Doors,PassengerDoorsOpen,LuggageDoorsOpen,NumSeats,NumOccupiedSeats,Load,Mass,RPM,MaxRPM,EngineTemperature,Throttle,Speed,AllowedSpeed,CruiseControlActive,Gearbox,Brake"
			fetchWithTimeout(TargetUrl, {timeout: 200})
			.then(data => {return data.json()})
			.then(data => {
				GlobalLampData = data.AllLamps;
				GlobalButtonData = data.Buttons;
				
				// Store engine and ignition status
				GlobalEngineStarted = data.EngineStarted;
				GlobalIgnitionEnabled = data.IgnitionEnabled;
				
				// Store Stop Request status from AllLamps
				if(data.AllLamps && data.AllLamps["DB Stop Request"] !== undefined) {
					GlobalStopRequest = (data.AllLamps["DB Stop Request"] > 0);
					GlobalSecondDoorRequest = (data.AllLamps["SecondDoorRequest"] > 0);
					GlobalThirdDoorRequest = (data.AllLamps["ThirdDoorRequest"] > 0);
					GlobalFourthDoorRequest = (data.AllLamps["FourthDoorRequest"] > 0);
				}
				
				// Store Wiper Level
				if(data.WiperLevel !== undefined) {
					GlobalWiperLevel = data.WiperLevel;
				}
				
				// Store fuel data
				if(data.CurrentFuel !== undefined) {
					GlobalCurrentFuel = data.CurrentFuel;
				}
				if(data.MaxFuel !== undefined) {
					GlobalMaxFuel = data.MaxFuel;
				}
				if(data.LowFuelWarning !== undefined) {
					GlobalLowFuelWarning = (data.LowFuelWarning === "true" || data.LowFuelWarning === true);
				}
				
				// Store passenger data
				if(data.NumSeats !== undefined) {
					GlobalNumSeats = data.NumSeats;
				}
				if(data.NumOccupiedSeats !== undefined) {
					GlobalNumOccupiedSeats = data.NumOccupiedSeats;
				}
				if(data.Load !== undefined) {
					GlobalLoad = data.Load;
				}
				if(data.Mass !== undefined) {
					GlobalMass = data.Mass;
				}
				if(data.PassengerDoorsOpen !== undefined) {
					GlobalPassengerDoorsOpen = (data.PassengerDoorsOpen === "true" || data.PassengerDoorsOpen === true);
				}
				if(data.LuggageDoorsOpen !== undefined) {
					GlobalLuggageDoorsOpen = (data.LuggageDoorsOpen === "true" || data.LuggageDoorsOpen === true);
				}
				if(data.Doors !== undefined && Array.isArray(data.Doors)) {
					GlobalDoorsOpen = data.Doors.filter(d => d.Open === "true" || d.Open === true).length;
				}
				
				// Store engine and speed data
				if(data.RPM !== undefined) {
					GlobalRPM = parseFloat(data.RPM);
				}
				if(data.MaxRPM !== undefined) {
					GlobalMaxRPM = parseFloat(data.MaxRPM);
				}
				if(data.EngineTemperature !== undefined) {
					GlobalEngineTemperature = parseFloat(data.EngineTemperature);
				}
				if(data.Throttle !== undefined) {
					GlobalThrottle = parseFloat(data.Throttle);
				}
				if(data.Speed !== undefined) {
					GlobalSpeed = parseFloat(data.Speed);
				}
				if(data.AllowedSpeed !== undefined) {
					GlobalAllowedSpeed = parseFloat(data.AllowedSpeed);
				}
				if(data.CruiseControlActive !== undefined) {
					GlobalCruiseControlActive = (data.CruiseControlActive === "true" || data.CruiseControlActive === true);
				}
				if(data.Gearbox !== undefined) {
					GlobalGearbox = data.Gearbox;
				}
				if(data.Brake !== undefined) {
					GlobalBrake = parseFloat(data.Brake);
				}
				
				// Store climate control values from Buttons
				if(data.Buttons) {
					var fanSpeed = data.Buttons.find(b => b.Name === "Driver Fan Speed");
					var driverTemp = data.Buttons.find(b => b.Name === "Driver Temperature");
					var acTemp = data.Buttons.find(b => b.Name === "Air Condition Temperature");
					
					if(fanSpeed && fanSpeed.Value !== undefined) GlobalFanSpeed = fanSpeed.Value;
					if(driverTemp && driverTemp.Value !== undefined) GlobalDriverTemp = driverTemp.Value;
					// AC Temp uses State, not Value - map state to value
					if(acTemp) {
						if(acTemp.State === "Primary") GlobalACTemp = 0.0;
						else if(acTemp.State === "Secondary") GlobalACTemp = 0.5;
						else if(acTemp.Value !== undefined) GlobalACTemp = acTemp.Value;
					}
				}

				// Update Sales
				if(GlobalPaymentStatus != data.BusLogic.Sales)
				{
					GlobalPaymentStatus = data.BusLogic.Sales;
					SaleStatusChanged();
				}

				// Update GEar
				GlobalCurrentGear = GetCurrentGear();
				if(data.IsPlayerControlled == "false")
				{
					CurrentVehicle = null;
				}

				//UpdateLamps
				GlobalIconUpdateData.forEach(IconUpdate => {
					UpdateIcon(IconUpdate.SourceType, IconUpdate.SourceName, IconUpdate.TargetValue, IconUpdate.OffIcon, IconUpdate.OnIcon, IconUpdate.Context);
				});
			})
		}
	}
	catch (error)
	{
		console.log("Get Telemetry Data Failed:" + error);
		ConnectionFailed();
	}
}

function ConnectionFailed()
{
	CurrentVehicle = null;
	SaleStatusChanged();
	GlobalLampData.forEach(LampData => {
		LampData = 0.0;
	});
}

$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');

	// Init Start Options
	StartOptions["BusName"] = "Scania_CitywideLF_18M4D";
	StartOptions["Weather"] = "Overcast";
	StartOptions["Date"] = "2023.7.4-1.0.0";
	StartOptions["SpawnInBus"] = "true";
	StartOptions["Map"] = "Berlin";
	StartOptions["OperatingPlanType"] = "Standard";
	StartOptions["OperatingPlan"] = "Standard_123";
	StartOptions["Line"] = "123";
	StartOptions["Stop"] = "Mäckeritzwiesen";
	StartOptions["Tour"] = "05";
	StartOptions["RouteIndex"] = "4";
});


$SD.onDidReceiveGlobalSettings(({payload}) =>
{
	// Set default values if not configured yet
	if(!payload.settings || !payload.settings.TargetIp || !payload.settings.TargetPort) {
		$SD.setGlobalSettings({
			TargetIp: "127.0.0.1",
			TargetPort: "37337"
		});
		GlobalTargetAddress = "127.0.0.1";
		GlobalTargetPort = "37337";
	} else {
		GlobalTargetAddress = payload.settings.TargetIp;
		GlobalTargetPort = payload.settings.TargetPort;
	}
	
	if(LastSendCommand != null)
	{
		SendTelemetryAction(LastSendCommand);
	}
});function AddInterval(Context, IntervalFunction)
{
	if(GlobalInterval["LampDataUpdate"] === undefined)
	{
		GlobalInterval["LampDataUpdate"] = setInterval( function() {UpdateTelemetryData() }, 300);
	}
	if(GlobalInterval["CurrentVehicleUpdate"] === undefined)
	{
		GlobalInterval["CurrentVehicleUpdate"] = setInterval ( function() {CheckCurrentVehicle()}, 1000);
	}

	if(GlobalInterval[Context] !== undefined)
	{
		clearInterval(GlobalInterval[Context]);
	}
	GlobalInterval[Context] = setInterval(IntervalFunction, 100)
}

function RemoveInterval(Context)
{
	if(GlobalInterval[Context] !== undefined)
	{
		clearInterval(GlobalInterval[Context]);
	}
}

function truncate(str, n)
{
	return (str.length > n) ? str.slice(0, n-2) + '...' : str;
};

// UpdateIcon(IconUpdate.SourceType, IconUpdate.SourceName, IconUpdate.TargetValue, IconUpdate.OffIcon, IconUpdate.OnIcon, IconUpdate.Context);
function AddIconUpdateData(SourceType, SourceName, SourceTargetValue, OffIcon, OnIcon, Context)
{

	if(GlobalInterval["LampDataUpdate"] === undefined)
	{
		GlobalInterval["LampDataUpdate"] = setInterval( function() {UpdateTelemetryData() }, 300);
	}
	if(GlobalInterval["CurrentVehicleUpdate"] === undefined)
	{
		GlobalInterval["CurrentVehicleUpdate"] = setInterval ( function() {CheckCurrentVehicle()}, 1000);
	}

	var newData = {};
	newData["SourceType"] = SourceType;
	newData["SourceName"] = SourceName;
	newData["TargetValue"] = SourceTargetValue;
	newData["OffIcon"] = OffIcon;
	newData["OnIcon"] = OnIcon;
	newData["Context"] = Context;

	if(GlobalIconUpdateData.indexOf(newData) < 0)
	{
		GlobalIconUpdateData.push(newData);
	}

}

function RemoveIconUpdateData(context)
{
	var removelist = [];
	for (let i = 0; i < GlobalIconUpdateData.length; i++) {
		const data = GlobalIconUpdateData[i];
		console.log(data); 
		if(data.Context == context)
		{
			removelist.push(i);
		}
	}

	removelist.forEach(localIndex => {
		delete GlobalIconUpdateData[localIndex];
	});
}


function UpdateButtonIcon(LightName, OnIcon, OffIcon, context)
{
	if(LightName && OnIcon && OffIcon && context)
	{
		var onIcon = "actions/assets/" + OnIcon;
		var offIcon = "actions/assets/" + OffIcon;
		
		UpdateIcon("light", LightName, "", offIcon, onIcon, context);
	}
}

function UpdateButtonState(ButtonName, ActiveState, OffIcon, OnIcon, context)
{
	if(ButtonName && ActiveState && OffIcon && OnIcon && context)
	{
		var offIcon = "actions/assets/" + OffIcon;
		var onIcon = "actions/assets/" + OnIcon;
		
		var button = GlobalButtonData.find(b => b.Name === ButtonName);
		if(button && button.State != GlobalCurrentState[context])
		{
			GlobalCurrentState[context] = button.State;
			if(button.State === ActiveState)
			{
				$SD.setImage(context, onIcon);
			}
			else
			{
				$SD.setImage(context, offIcon);
			}
		}
	}
}

function UpdateIcon(SourceType, SourceName, SourceTargetValue, OffIcon, OnIcon, Context)
{
	if(!SourceType || !SourceName || !OffIcon || !OnIcon || !Context)
	{
		return;
	}

	switch(SourceType)
	{
		case "button":
			if(SourceTargetValue)
			{
				GlobalButtonData.forEach(ButtonData => {
					if(ButtonData.Name == SourceName && ButtonData.State != GlobalCurrentState[Context])
					{
						GlobalCurrentState[Context] = ButtonData.State;
						if(ButtonData.State == SourceTargetValue)
						{
							$SD.setImage(Context, OnIcon);
							return;
						}
						$SD.setImage(Context, OffIcon);
						return;
					}
				});
			}
			break;
	case "light":
		if(GlobalLampData[SourceName] != GlobalCurrentState[Context])
		{
			GlobalCurrentState[Context] = GlobalLampData[SourceName];
			if(GlobalLampData[SourceName] >= 1.0)
			{
				$SD.setImage(Context, OnIcon);
				return;
			}
			$SD.setImage(Context, OffIcon);
			return;
		}
		break;
}
}
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Door Action Functions

DoorAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Handle Lock Left/Right with toggle logic
	// States: Primary = Middle/Off, Tertiary = Left, Secondary = Right
	if(payload.settings.DoorSelector == "Lock Left") {
		var doorLockButton = GlobalButtonData?.find(b => b.Name === "DoorLock 1");
		if(doorLockButton && doorLockButton.State === "Tertiary") {
			// Already locked left, go back to middle
			SendTelemetryAction("/sendeventpress?event=DoorWingLockOff");
		} else if(doorLockButton && doorLockButton.State === "Secondary") {
			// Currently locked right, cannot toggle to left (user must unlock first)
			return;
		} else {
			// Currently middle, lock left
			SendTelemetryAction("/sendeventpress?event=DoorWingLockLeft");
		}
		return;
	}
	
	if(payload.settings.DoorSelector == "Lock Right") {
		var doorLockButton = GlobalButtonData?.find(b => b.Name === "DoorLock 1");
		if(doorLockButton && doorLockButton.State === "Secondary") {
			// Already locked right, go back to middle
			SendTelemetryAction("/sendeventpress?event=DoorWingLockOff");
		} else if(doorLockButton && doorLockButton.State === "Tertiary") {
			// Currently locked left, cannot toggle to right (user must unlock first)
			return;
		} else {
			// Currently middle, lock right
			SendTelemetryAction("/sendeventpress?event=DoorWingLockRight");
		}
		return;
	}
	
	// Map other door selections to event names (Mercedes Citaro)
	var eventMapping = {
		"Door 1": "DoorFrontOpenClose",
		"Door 2": "DoorMiddleOpenClose",
		"Door 3": "DoorRearOpenClose",
		"Door 4": "DoorFourthOpenClose",
		"Clearance": "ToggleDoorClearance",
		"Auto Kneeling": "Pedestrians",
		"Door Autoclose": "ToggleAutomaticRearDoorClosing"
	};
	
	var eventName = eventMapping[payload.settings.DoorSelector];
	
	if(eventName) {
		SendTelemetryAction("/sendeventpress?event=" + eventName);
	} else {
		// Fallback to button method for unknown options
		SendTelemetryAction("/setbutton?button=" + payload.settings.DoorSelector + "&state=1");
	}
});

DoorAction.onKeyUp(({ action, context, device, event, payload }) => {
	if(payload.settings.DoorSelector  == "Clearance")
	{
		return;	
	}
	// Only use button release for non-mapped doors
	var eventName = null;
	switch(payload.settings.DoorSelector) {
		case "Door 1":
		case "Door 2":
		case "Door 3":
		case "Door 4":
			// Solaris doors use toggle events, no need for release
			return;
	}
	SendTelemetryAction("/setbutton?button=" + payload.settings.DoorSelector + "&state=0");
});

DoorAction.onWillAppear(({ action, context, device, event, payload }) =>
{
	// Get settings - this will trigger onDidReceiveSettings
	$SD.getSettings(context);
});

DoorAction.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.dooraction", ({context, payload}) => 
{
	// Clear any existing intervals first
	RemoveInterval(context);
	
	DoorName = payload.settings.DoorSelector
	if(DoorName === undefined) 
	{
		DoorName = "Door 1";
		payload.settings.DoorSelector = "Door 1";
		$SD.setSettings(context, payload.settings);
	}
	
	// Handle special door functions
	if(DoorName == "Clearance")
	{
		$SD.setImage(context, "actions/assets/door_auto.png");
		AddInterval(context, function() {
			// Mercedes uses boolean true/false, Solaris uses "Secondary" state
			var button = GlobalButtonData.find(b => b.Name === "DoorClearance");
			if(button) {
				var isActive = (button.State === true || button.State === "true" || button.State === "Secondary");
				var newImage = isActive ? "actions/assets/door_auto_open.png" : "actions/assets/door_auto.png";
				if(GlobalCurrentState[context] != newImage) {
					GlobalCurrentState[context] = newImage;
					$SD.setImage(context, newImage);
				}
			}
		});
		return;
	}
	
	// Handle Lock Left Doors with status tracking
	// Works with DoorLock 1 (Mercedes/Citaro) or Door Lock Left (Solaris)
	if(DoorName == "Lock Left")
	{
		$SD.setImage(context, "actions/assets/1_door_close_left.png");
		AddInterval(context, function() {
			UpdateButtonState("DoorLock 1", "Tertiary", "1_door_close_left.png", "1_door_close_left_on.png", context);
		});
		return;
	}
	
	// Handle Lock Right Doors with status tracking
	// Works with DoorLock 1 (Mercedes/Citaro) or Door Lock Right (Solaris)
	if(DoorName == "Lock Right")
	{
		$SD.setImage(context, "actions/assets/1_door_close_right.png");
		AddInterval(context, function() {
			UpdateButtonState("DoorLock 1", "Secondary", "1_door_close_right.png", "1_door_close_right_on.png", context);
		});
		return;
	}
	
	// For other new functions (Auto Kneeling, Autoclose), just show a generic icon
	if(DoorName == "Auto Kneeling")
	{
		// Set initial icon based on current state
		var button = GlobalButtonData.find(b => b.Name === "AutomaticKneeling");
		if(button) {
			var isActive = (button.State !== true && button.State !== "true" && button.State !== "Off") || button.State === "Secondary";
			$SD.setImage(context, isActive ? "actions/assets/auto_kneeling_on.png" : "actions/assets/auto_kneeling.png");
		} else {
			$SD.setImage(context, "actions/assets/auto_kneeling.png");
		}
		
		AddInterval(context, function() {
			// Mercedes uses boolean BUT INVERTED: true = OFF, false = ON
			// Solaris uses "Secondary" state for ON
			var button = GlobalButtonData.find(b => b.Name === "AutomaticKneeling");
			if(button) {
				var isActive = (button.State !== true && button.State !== "true" && button.State !== "Off") || button.State === "Secondary";
				var newImage = isActive ? "actions/assets/auto_kneeling_on.png" : "actions/assets/auto_kneeling.png";
				if(GlobalCurrentState[context] != newImage) {
					GlobalCurrentState[context] = newImage;
					$SD.setImage(context, newImage);
				}
			}
		});
		return;
	}
	
	if(DoorName == "Door Autoclose")
	{
		// Track the AutomaticDoorClosing button status
		$SD.setImage(context, "actions/assets/kinderwagen.png");
		AddInterval(context, function() {
			// Mercedes uses boolean, Solaris uses "Secondary" state
			var button = GlobalButtonData.find(b => b.Name === "AutomaticDoorClosing");
			if(button) {
				var isActive = (button.State === true || button.State === "true" || button.State === "Secondary");
				var newImage = isActive ? "actions/assets/kinderwagen_on.png" : "actions/assets/kinderwagen.png";
				if(GlobalCurrentState[context] != newImage) {
					GlobalCurrentState[context] = newImage;
					$SD.setImage(context, newImage);
				}
			}
		});
		return;
	}
	
	// Get door number from selection (Door 1 → 1, Door 2 → 2, etc.)
	var doorNumber = DoorName.replace("Door ", "");
	$SD.setImage(context, "actions/assets/" + doorNumber + ".png")
	
	// Use different lamp names for different doors
	AddInterval(context, function() {
		var lampValue = 0.0;
		
		// Try Mercedes naming first, then fallback to Solaris
		if(doorNumber == "1") {
			lampValue = GlobalLampData["ButtonLight Door 1"] || GlobalLampData["Door 1 Light"] || 0.0;
		} else if(doorNumber == "2") {
			lampValue = GlobalLampData["ButtonLight Door 2"] || GlobalLampData["Second Door Light Ext"] || 0.0;
		} else if(doorNumber == "3") {
			lampValue = GlobalLampData["ButtonLight Door 3"] || GlobalLampData["Third Door Light Ext"] || 0.0;
		} else if(doorNumber == "4") {
			lampValue = GlobalLampData["ButtonLight Door 4"] || GlobalLampData["Fourth Door Light Ext"] || 0.0;
		}
		
		if(GlobalCurrentState[context] != lampValue)
		{
			GlobalCurrentState[context] = lampValue;
			
			if(lampValue > 0.0)
			{
				// Door open
				$SD.setImage(context, "actions/assets/" + doorNumber + "_2.png")
			}
			else
			{
				// Door closed
				$SD.setImage(context, "actions/assets/" + doorNumber + ".png")
			}
		}
	})
	
});

function UpdateButtonLightStatus(LightName, context, doorNumber)
{
	// Try both naming conventions: "ButtonLight Door 1" (old) and "Door Button 1" (Solaris)
	var lampValue = GlobalLampData[LightName];
	if(lampValue === undefined) {
		// Fallback: Try "Door Button X" format for Solaris
		lampValue = GlobalLampData["Door Button " + doorNumber];
	}
	
	console.log("UpdateButtonLightStatus - Door " + doorNumber + ", LightName: " + LightName + ", lampValue: " + lampValue);
	
	if(GlobalCurrentState[context] != lampValue)
	{
		GlobalCurrentState[context] = lampValue
		NewState = lampValue

		console.log("Door " + doorNumber + " Status changed to: " + NewState);

		if(NewState > 0.0)
		{
			// Door open - use _2.png variant
			console.log("Setting image to: actions/assets/" + doorNumber + "_2.png");
			$SD.setImage(context, "actions/assets/" + doorNumber + "_2.png")
		}
		else
		{
			// Door closed - use .png
			console.log("Setting image to: actions/assets/" + doorNumber + ".png");
			$SD.setImage(context, "actions/assets/" + doorNumber + ".png")
		}
	}
}

function UpdateDoorLockStatusByState(context, buttonNames, primaryState, fallbackState, iconOff, iconOn)
{
	// Universal door lock function - works with any bus model
	// Checks multiple possible button names and states
	// primaryState: e.g., "DoorWingLockLeft" for Mercedes
	// fallbackState: e.g., "Secondary" for Solaris/others
	
	var buttonState = null;
	var foundButton = false;
	
	// Check if GlobalButtonData is valid
	if(!GlobalButtonData || GlobalButtonData.length === 0) {
		// Data not loaded yet, show default icon
		$SD.setImage(context, "actions/assets/" + iconOff);
		return;
	}
	
	// Try to find any of the possible button names
	for(var nameIdx = 0; nameIdx < buttonNames.length; nameIdx++) {
		for(var i = 0; i < GlobalButtonData.length; i++) {
			if(GlobalButtonData[i].Name === buttonNames[nameIdx]) {
				buttonState = GlobalButtonData[i].State;
				foundButton = true;
				break;
			}
		}
		if(foundButton) break;
	}
	
	// Determine which icon to show based on state
	var newImage = "";
	if(buttonState === primaryState || buttonState === fallbackState) {
		// Locked (matches primary or fallback state)
		newImage = "actions/assets/" + iconOn;
	} else {
		// Unlocked (Primary or other state)
		newImage = "actions/assets/" + iconOff;
	}
	
	// Only update if changed
	if(GlobalCurrentState[context] != newImage) {
		GlobalCurrentState[context] = newImage;
		$SD.setImage(context, newImage);
	}
}

function UpdateDoorLockStatus(context, buttonNames, targetState, iconOff, iconOn)
{
	// Simplified door lock function - checks if button state matches exactly
	// Works for Mercedes (Tertiary/Secondary) and Solaris (both use Secondary for their respective buttons)
	
	var buttonState = null;
	var foundButton = false;
	
	// Check if GlobalButtonData is valid
	if(!GlobalButtonData || GlobalButtonData.length === 0) {
		// Data not loaded yet, show default icon
		$SD.setImage(context, "actions/assets/" + iconOff);
		return;
	}
	
	// Try to find any of the possible button names
	for(var nameIdx = 0; nameIdx < buttonNames.length; nameIdx++) {
		for(var i = 0; i < GlobalButtonData.length; i++) {
			if(GlobalButtonData[i].Name === buttonNames[nameIdx]) {
				buttonState = GlobalButtonData[i].State;
				foundButton = true;
				break;
			}
		}
		if(foundButton) break;
	}
	
	// For Mercedes DoorLock 1:
	// - Lock Left needs Tertiary
	// - Lock Right needs Secondary
	// For Solaris Door Lock Left/Right:
	// - Both use Secondary
	
	// Determine which icon to show based on exact state match
	var newImage = "";
	if(buttonState === targetState) {
		// Locked (state matches exactly)
		newImage = "actions/assets/" + iconOn;
	} else {
		// Unlocked
		newImage = "actions/assets/" + iconOff;
	}
	
	// Only update if changed
	if(GlobalCurrentState[context] != newImage) {
		GlobalCurrentState[context] = newImage;
		$SD.setImage(context, newImage);
	}
}

function UpdateButtonState(ButtonName, ActiveState, OffIcon, OnIcon, context)
{
	if(ButtonName && ActiveState && OffIcon && OnIcon && context)
	{
		var offIcon = "actions/assets/" + OffIcon;
		var onIcon = "actions/assets/" + OnIcon;
		
		var button = GlobalButtonData.find(b => b.Name === ButtonName);
		if(button && button.State != GlobalCurrentState[context])
		{
			GlobalCurrentState[context] = button.State;
			if(button.State === ActiveState)
			{
				$SD.setImage(context, onIcon);
			}
			else
			{
				$SD.setImage(context, offIcon);
			}
		}
	}
}

function UpdateDoorLockStatusMercedes(context, buttonName, targetState, iconOff, iconOn)
{
	// Mercedes-specific: Check if DoorLock 1 State matches targetState (DoorWingLockLeft or DoorWingLockRight)
	var buttonState = null;
	
	// Check if GlobalButtonData is valid
	if(!GlobalButtonData || GlobalButtonData.length === 0) {
		// Data not loaded yet, show default icon
		$SD.setImage(context, "actions/assets/" + iconOff);
		return;
	}
	
	for(var i = 0; i < GlobalButtonData.length; i++) {
		if(GlobalButtonData[i].Name === buttonName) {
			buttonState = GlobalButtonData[i].State;
			break;
		}
	}
	
	// Determine which icon to show based on state
	// If State matches targetState (e.g., DoorWingLockLeft), show locked icon
	var newImage = "";
	if(buttonState === targetState) {
		// Locked (matches DoorWingLockLeft or DoorWingLockRight)
		newImage = "actions/assets/" + iconOn;
	} else {
		// Unlocked (Primary or other state)
		newImage = "actions/assets/" + iconOff;
	}
	
	// Only update if changed
	if(GlobalCurrentState[context] != newImage) {
		GlobalCurrentState[context] = newImage;
		$SD.setImage(context, newImage);
	}
}

function UpdateDoorLockStatus(context, buttonName, iconOff, iconOn)
{
	// Get button state from GlobalButtonData array
	var buttonState = null;
	
	// Check if GlobalButtonData is valid
	if(!GlobalButtonData || GlobalButtonData.length === 0) {
		// Data not loaded yet, show default icon
		$SD.setImage(context, "actions/assets/" + iconOff);
		return;
	}
	
	for(var i = 0; i < GlobalButtonData.length; i++) {
		if(GlobalButtonData[i].Name === buttonName) {
			buttonState = GlobalButtonData[i].State;
			break;
		}
	}
	
	// Determine which icon to show based on state
	// "Primary" = unlocked, "Secondary" = locked
	var newImage = "";
	if(buttonState === "Secondary") {
		// Locked
		newImage = "actions/assets/" + iconOn;
	} else {
		// Unlocked (Primary or undefined)
		newImage = "actions/assets/" + iconOff;
	}
	
	// Only update if changed
	if(GlobalCurrentState[context] != newImage) {
		GlobalCurrentState[context] = newImage;
		$SD.setImage(context, newImage);
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Cash Action Functions

CashAction.onKeyUp(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=" + payload.settings.CashChangeSelect)
});

CashAction.onWillAppear(({ action, context, device, event, payload }) =>
{
	$SD.getSettings(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.changeaction", ({context, payload}) => 
{
	console.log(payload)
	var selected = payload.settings.CashChangeSelect
	if(selected == undefined)
	{
		payload.settings.CashChangeSelect = "Coins5"
		$SD.setSettings(context, payload.settings);
	}
	

	if(payload.settings.hasOwnProperty("AutoLabel"))
		GenerateAutLabel(selected, context)
});




function GenerateAutLabel(selected, context)
{
	var newTitle = ""

	switch(selected)
	{
		case "Coins5":
			newTitle = "0.05 €";
			break;
		case "Coins10":
			newTitle = "0.10 €";
			break;
		case "Coins15":
			newTitle = "0.15 €";
			break;
		case "Coins20":
			newTitle = "0.20 €";
			break;
		case "Coins30":
			newTitle = "0.30 €";
			break;
		case "Coins50":
			newTitle = "0.50 €";
			break;
		case "Coins60":
			newTitle = "0.60 €";
			break;
		case "Coins100":
			newTitle = "1.00 €";
			break;
		case "Coins200":
			newTitle = "2.00 €";
			break;
		case "Coins400":
			newTitle = "4.00 €";
			break;
		case "Coins600":
			newTitle = "6.00 €";
			break;
		case "Coins800":
			newTitle = "8.00 €";
			break;
		case "Take Cash Money":
			newTitle = "Grab";
			break;
	}

	$SD.setTitle(context, newTitle)
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Gearswitch Action Functions

function GetCurrentGear()
{
	for(button in GlobalButtonData)
	{
		if(GlobalButtonData[button].Name == "GearSwitch")
			return GlobalButtonData[button].State
	}
	return null
}


function SetGearswitchIcon(ButtonIndex, context)
{
	IconId = "R"
	ButtonState = "Reverse"
	if(ButtonIndex == 2)
	{
		IconId = "N"
		ButtonState = "Neutral"
	}
	if(ButtonIndex == 1)
	{
		IconId = "D";
		ButtonState = "Drive";
	}

	IconState = "Normal";
	if(GlobalCurrentGear == ButtonState)
		IconState = "Pushed";
	
	$SD.setImage(context, "actions/assets/Icon_" + IconId + "_" + IconState)
}

GearSwitchAction.onKeyUp(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/setbutton?button=GearSwitch&state=" + (payload.settings.GearSelection - 1))
});

GearSwitchAction.onWillAppear(({ action, context, device, event, payload }) =>
{
	$SD.getSettings(context);
});

DoorAction.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});

GearSwitchAction.onKeyDown(({ action, context, device, event, payload }) => {
	var gearSelection = parseInt(payload.settings.GearSelection);
	var eventName = "";
	
	switch(gearSelection) {
		case 1: // Drive
			eventName = "SetGearD";
			break;
		case 2: // Neutral
			eventName = "SetGearN";
			break;
		case 3: // Reverse
			eventName = "SetGearR";
			break;
		default:
			eventName = "SetGearN";
	}
	
	SendTelemetryAction("/sendeventpress?event=" + eventName);
	setTimeout(() => SendTelemetryAction("/sendeventrelease?event=" + eventName), 100);
});

GearSwitchAction.onWillAppear(({ action, context, device, event, payload }) =>
{
	$SD.getSettings(context);
});

GearSwitchAction.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.gearselect", ({context, payload}) => 
{
	console.log(context);
	var ButtonGear = payload.settings.GearSelection;
	if(ButtonGear == undefined)
	{
		ButtonGear = 2;
		payload.settings.GearSelection = 2;
		$SD.setSettings(context, payload.settings);
	}

	AddInterval(context, function() {SetGearswitchIcon(ButtonGear, context)})
	
});


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Ignition Action Functions

IgnitionAction.onKeyUp(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventrelease?event=MotorStartStop")
});

IgnitionAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=MotorStartStop")
});

IgnitionAction.onWillAppear(({ action, context, device, event, payload }) => {
	// Set initial icon
	$SD.setImage(context, "actions/assets/Icon_Ignition.png");
	
	// Get settings
	$SD.getSettings(context);
	
	// Start tracking engine and ignition status
	AddInterval(context, function() { UpdateIgnitionStatus(context, payload.settings); });
});

IgnitionAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// Track settings for each ignition button context
var GlobalIgnitionSettings = {};

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.ignition", ({context, payload}) => {
	// Store settings for this button
	GlobalIgnitionSettings[context] = payload.settings;
});

function UpdateIgnitionStatus(context, settings) {
	// Get settings from global storage if not provided
	if(!settings) {
		settings = GlobalIgnitionSettings[context] || {};
	}
	
	// Check if user wants to show status info (default: true)
	var showStatus = settings.ShowStatus;
	if(showStatus === undefined) {
		showStatus = true;
	}
	
	// Check both EngineStarted and IgnitionEnabled from global variables
	// Values come as strings "true"/"false" from API
	var newImage = "";
	var statusText = "";
	
	if(GlobalEngineStarted === "true" || GlobalEngineStarted === true) {
		// Motor läuft
		newImage = "actions/assets/Icon_Ignition_motorstart.png";
		statusText = "MOTOR\nAN";
	} else if(GlobalIgnitionEnabled === "true" || GlobalIgnitionEnabled === true) {
		// Zündung an, aber Motor aus
		newImage = "actions/assets/Icon_Ignition_zündung.png";
		statusText = "ZÜNDUNG\nAN";
	} else {
		// Bus komplett aus
		newImage = "actions/assets/Icon_Ignition.png";
		statusText = "AUS";
	}
	
	// Only update if image or text changed
	if(GlobalCurrentState[context] != newImage) {
		GlobalCurrentState[context] = newImage;
		$SD.setImage(context, newImage);
		
		// Only show status text if checkbox is enabled
		if(showStatus) {
			$SD.setTitle(context, statusText);
		} else {
			$SD.setTitle(context, "");
		}
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Climate Display Function

function UpdateClimateDisplay(context, displayType, settings) {
	// Check if user wants to show info (default: true)
	var showTemperature = settings.ShowTemperature;
	if(showTemperature === undefined) {
		showTemperature = true;
	}
	
	if(!showTemperature) {
		$SD.setTitle(context, "");
		return;
	}
	
	var displayText = "";
	
	if(displayType === "Fan Speed Display") {
		// Display fan speed as percentage (0.0 - 1.0 → 0% - 100%)
		var fanPercent = Math.round(GlobalFanSpeed * 100);
		displayText = "FAN\n" + fanPercent + "%";
	} else if(displayType === "Driver Temp Display") {
		// Display driver temperature as percentage
		var driverPercent = Math.round(GlobalDriverTemp * 100);
		displayText = "TEMP\n" + driverPercent + "%";
	} else if(displayType === "AC Temp Display") {
		// Display AC temperature as percentage
		var acPercent = Math.round(GlobalACTemp * 100);
		displayText = "AC\n" + acPercent + "%";
	}
	
	// Always update display
	GlobalCurrentState[context] = displayText;
	$SD.setTitle(context, displayText);
}

function UpdateStopRequestStatus(context) {
	// Check stop request from global variable
	var newImage = "";
	var displayText = "";
	
	if(GlobalStopRequest === true) {
		// Stop request active
		newImage = "actions/assets/Haltestelle1_2.png";
		
		// Check which doors have requests
		var doorRequests = [];
		if(GlobalSecondDoorRequest) doorRequests.push("2");
		if(GlobalThirdDoorRequest) doorRequests.push("3");
		if(GlobalFourthDoorRequest) doorRequests.push("4");
		
		if(doorRequests.length > 0) {
			displayText = "STOP\nREQUEST\nTÜR " + doorRequests.join(", ");
		} else {
			displayText = "STOP\nREQUEST";
		}
	} else {
		// No stop request
		newImage = "actions/assets/Haltestelle.png";
		displayText = "";
	}
	
	// Update image
	if(GlobalCurrentState[context] != newImage) {
		GlobalCurrentState[context] = newImage;
		$SD.setImage(context, newImage);
	}
	
	// Update text
	$SD.setTitle(context, displayText);
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// FixingBrake Action Functions
FixingBrakeAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=FixingBrake")
});

FixingBrakeAction.onWillAppear(({ action, context, device, event, payload }) =>
{
	AddInterval(context, function() { UpdateButtonIcon("Dashboard Fixing Brake", "Icon_Brake_On.png", "Icon_Brake_Off.png", context); });
});

FixingBrakeAction.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// CustomAction

CustomAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendCustomAction(payload, true);
});

CustomAction.onKeyUp(({ action, context, device, event, payload }) => {
	SendCustomAction(payload, false);
});

function SendCustomAction(payload, bIsPress)
{
	if(payload.settings.TypeSelection == undefined)
	{
		payload.settings.TypeSelection = "Event";
		$SD.setSettings(context, payload.settings);
	}

	var ActionType = payload.settings.TypeSelection;
	var Data = payload.settings.CustomData;

	if(ActionType == "Event")
	{
		if(bIsPress)
		{
			SendTelemetryAction("/sendeventpress?event=" + Data);
			return;
		}
		SendTelemetryAction("/sendeventrelease?event=" + Data);
		return;
	}
	if(ActionType == "Cmd" && bIsPress)
	{
		SendTelemetryCommand(Data);
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Sale Status
SaleStatus.onWillAppear(({ action, context, device, event, payload }) =>
{
	SaleStatusRegister[context] = payload;
});

SaleStatus.onWillDisappear(({ action, context, device, event, payload }) =>
{
	SaleStatusRegister[context] = null;
});

function SaleStatusChanged()
{
	var mainImage = "actions/assets/Icon_SaleStatusIncomplete";

	if(GlobalPaymentStatus.ChangeAmountCorrect == "true")
	{
		mainImage = "actions/assets/Icon_SaleStatusComplete";
	}
	if(GlobalPaymentStatus.SaleInProgress == "false")
	{
		mainImage = "actions/assets/Icon_SaleStatus";
	}
	
	newImage = mainImage;

	Object.keys(SaleStatusRegister).forEach(SaleContext => {
		newTitle = "";
		
		curPayload = SaleStatusRegister[SaleContext];
		if(curPayload == null) 
		{
			return;
		}

		if(GlobalPaymentStatus.SaleInProgress == "true" && CurrentVehicle != null)
		{
			newImage = mainImage;
			switch(curPayload.settings.DisplayType)
			{
				case "Ticket":
				case undefined:
					{
						newTitle = "Ticket\n" + truncate(GlobalPaymentStatus.Ticket, 10) + "\n" + truncate(GlobalPaymentStatus.Zone, 10);
						break;
					}
				case "PayMethod":
					{
						newTitle =  "Method\n" + truncate(GlobalPaymentStatus.PaymentMethodText, 10);
						break;
					}
				case "Price":
					{
						newTitle = "Price\n" + GlobalPaymentStatus.Price;
						break;
					}
				case "Paid":
					{
						var tempString = (GlobalPaymentStatus.PaymentMethod == "Cash") ? GlobalPaymentStatus.Paid : "---";
						newTitle = "Paid\n" + tempString;
						break;
					}
				case "Change":
					{
						var tempString = (GlobalPaymentStatus.PaymentMethod == "Cash") ? GlobalPaymentStatus.ChangeGiven : "---";
						newTitle = "Change\n" + tempString;
						break;
					}
				case "PayMethodIcon":
					{
						newImage = "actions/assets/Icon_PayMethod" + GlobalPaymentStatus.PaymentMethod;
						newTitle = "";
						break;
					}
				default:
					{
						newTitle = "";
						break;
					}
			}
		}

		$SD.setImage(SaleContext, newImage);

		$SD.setTitle(SaleContext, newTitle)
	});
}

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.paymentstatus", ({context, payload}) => 
{
	SaleStatusRegister[context] = payload;
	SaleStatusChanged();
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// StartOptions

StartOptionAction.onKeyDown(({ action, context, device, event, payload }) => {
	if(payload.settings.StartOption == "Start")
	{
		SendStartCommand()
		return;
	}

	StartOptions[payload.settings.StartOption] = payload.settings.CustomData;

});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.start", ({context, payload}) => 
{
	if(payload.settings.StartOption === undefined)
	{
		payload.settings.StartOption = "BusName";
		$SD.setSettings(context, payload.settings)
	}
});

function SendStartCommand()
{
	var Command = "QuickStart"
	Command += " BusName=" + StartOptions["BusName"];
	Command += " ,Weather=" + StartOptions["Weather"];
	Command += " ,Date=" + StartOptions["Date"];
	Command += " ,SpawnInBus=" + StartOptions["SpawnInBus"];
	Command += " ,Map=" + StartOptions["Map"];
	Command += " ,OperatingPlanType=" + StartOptions["OperatingPlanType"];
	Command += " ,OperatingPlan=" + StartOptions["OperatingPlan"];
	Command += " ,Line=" + StartOptions["Line"];
	Command += " ,Stop=" + StartOptions["Stop"];
	Command += " ,Tour=" + StartOptions["Tour"];
	Command += " ,RouteIndex=" + StartOptions["RouteIndex"];

	SendTelemetryCommand(Command);
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Connection Status

ConnectionStatus.onWillAppear(({ action, context, device, event, payload }) =>
{
	AddInterval(context, function() {updateConnectionSatatus(context);});
});

ConnectionStatus.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});



function updateConnectionSatatus(context)
{
	image = "actions/assets/Icon_Error"
	text = "Not\nConnected"

	if(failedConnectionCounter < 10)
	{
		image = "actions/assets/Icon_Connected"
		text = "Connected"
		if(CurrentVehicle != null)
		{
			image = "actions/assets/Icon_Bus"
			text = "In\nBus"
		}
	}

	$SD.setImage(context, image);
	$SD.setTitle(context, text);
}


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Indicator Control

IndicatorControl.onWillAppear(({ action, context, device, event, payload }) =>
{
	$SD.getSettings(context);

});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.indicatorcontrol", ({context, payload}) => 
{
	var lightName = null;
	var iconOn = null;
	var iconOff = null;

	if(payload.settings.IndicatorSelector === undefined)
	{
		payload.settings.IndicatorSelector = "IndicatorLeft";
		$SD.setSettings(context, payload.settings);
	}

	switch(payload.settings.IndicatorSelector)
	{
		case "IndicatorLeft": 
			lightName = "IndicatorLeft";
			iconOff = "Icon_IndicatorLeftOff";
			iconOn = "Icon_IndicatorLeftOn";
			break;

		case "IndicatorRight":
			lightName = "IndicatorRight";
			iconOff = "Icon_IndicatorRightOff";
			iconOn = "Icon_IndicatorRightOn";
			break;
		
		case "WarningLights":
			lightName = "ButtonLight WarningLights";
			iconOff = "Icon_WarningLightsOff";
			iconOn = "Icon_WarningLightsOn";
			break;
	}
	if(lightName && iconOff && iconOn)
	{
		GlobalCurrentState[context] = -1;
		AddInterval(context, function() {UpdateButtonIcon(lightName, iconOn, iconOff, context) ;});
	}
});

IndicatorControl.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});

IndicatorControl.onKeyDown(({ action, context, device, event, payload }) => 
{
	IndicatorAction = null
	
	switch(payload.settings.IndicatorSelector)
	{
		case "IndicatorLeft": 
			IndicatorAction = "/sendevent?event=IndicatorDown";
			break;

		case "IndicatorRight":
			IndicatorAction = "/sendevent?event=IndicatorUp";
			break;
		
		case "WarningLights":
			IndicatorAction = "/sendevent?event=ToggleWarningLights";
			break;
	}

	if(IndicatorAction)
	{
		SendTelemetryAction(IndicatorAction);
	}
});


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Custom Button
CustomButtonAction.onWillAppear(({ action, context, device, event, payload }) =>
{
	$SD.getSettings(context);

});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.custombutton", ({context, payload}) => 
{
	IconUpdate(context, payload);
});

CustomButtonAction.onWillDisappear(({ action, context, device, event, payload }) =>
{
	RemoveInterval(context);
});

CustomButtonAction.onKeyDown(({ action, context, device, event, payload }) => 
{
	SendCustomButtonAction(action, context, device, event, payload, true);
});

CustomButtonAction.onKeyUp(({ action, context, device, event, payload }) => 
{
	SendCustomButtonAction(action, context, device, event, payload, false);
});

function SendCustomButtonAction(action, context, device, event, payload, bPressed)
{
	switch(payload.settings.ButtonFunctionType)
	{
		case "button":
			try
			{
				if(payload.settings.OnPressAction && bPressed)
				{
					data = JSON.parse(payload.settings.OnPressAction)
					SendTelemetryAction("/setbutton?button=" + data.button + "&state=" + data.state)
				}
				if(payload.settings.OnReleaseAction && !bPressed)
				{
					data = JSON.parse(payload.settings.OnReleaseAction)
					SendTelemetryAction("/setbutton?button=" + data.button + "&state=" + data.state)
				}
			}
			catch
			{
			}
			return;

		case "event":
			try
			{
				var sendeventtype = "/sendevent?event=";
				var Data = payload.settings.OnReleaseAction;
				if(payload.settings.OnPressAction && payload.settings.OnReleaseAction)
				{
					sendeventtype = "/sendeventrelease?event=";
					if(bPressed)
					{
						sendeventtype = "/sendeventpress?event=";
					}
				}
				if(bPressed)
				{
					Data = payload.settings.OnPressAction;
				}
				SendTelemetryAction(sendeventtype + Data);
			}
			catch
			{
			}
			return;
	}
}

function IconUpdate(context, payload)
{
	RemoveIconUpdateData(context);
	if((payload.settings.DefaultIcon && !payload.settings.TrueIcon) || (payload.settings.DefaultIcon && payload.settings.ButtonFeedbackType == "off"))
	{
		$SD.setImage(context, payload.settings.DefaultIcon);
		return;
	}
	if(payload.settings.DefaultIcon && payload.settings.TrueIcon && payload.settings.ButtonFeedbackType != "off" && payload.settings.SourceName)
	{
		var OffIcon = payload.settings.DefaultIcon;
		var OnIcon = payload.settings.TrueIcon;
		var FeedbackType = payload.settings.ButtonFeedbackType;
		var SourceName = payload.settings.SourceName;
		var TrueState = payload.settings.TrueState;

		AddIconUpdateData(FeedbackType, SourceName, TrueState, OffIcon, OnIcon, context);
		return;
	}
	
	$SD.setImage(context, "actions/assets/Icon_Custom");
	
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Light Control Action Functions

LightControlAction.onKeyDown(({ action, context, device, event, payload }) => {
	var lightSelection = payload.settings.LightSelector;
	if(!lightSelection) {
		lightSelection = "Headlight";
	}
	
	// Map light selection to correct event name
	var eventMapping = {
		"Headlight": "ToggleLightSwitch",
		"Main Light": "ToggleMainLight",
		"Traveller Lights": "ToggleTravellerLights",
		"Fog Light Front": "ToggleFogLight",
		"Fog Light Rear": "ToggleFogLightRear",
		"Warning Light": "ToggleWarningLights",
		"Interior Light": "TogglePassengersLight",
		"Interior Light Full": "INTLightFull",
		"Interior Light Dim": "INTLightDim",
		"Interior Light Left": "INTLightLeftOnly",
		"Interior Light Right": "INTLightRightOnly",
		"Driver Light": "ToggleDriversLight"
	};
	
	var eventName = eventMapping[lightSelection] || "ToggleLightSwitch";
	
	// Use /sendevent like door buttons
	SendTelemetryAction("/sendeventpress?event=" + eventName);
});

LightControlAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

LightControlAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.lightcontrol", ({context, payload}) => {
	var lightName = payload.settings.LightSelector;
	if(!lightName) {
		lightName = "Headlight";
		payload.settings.LightSelector = "Headlight";
		$SD.setSettings(context, payload.settings);
	}
	
	// Map light selection to LED name and icons
	var lightConfig = {
		"Headlight": {
			led: "LightHeadlight",
			iconOff: "low-beam.png",
			iconOn: "low-beam-c.png"
		},
		"Main Light": {
			led: "LightParking",
			iconOff: "side-markers.png",
			iconOn: "side-markers-c.png"
		},
		"Traveller Lights": {
			led: "LightFlasher",
			iconOff: "high-beam.png",
			iconOn: "high-beam-c.png"
		},
		"Fog Light Front": {
			led: "LightFog",
			iconOff: "fog-lamp-front.png",
			iconOn: "fog-lamp-front-c.png"
		},
		"Fog Light Rear": {
			led: "LightRearFog",
			iconOff: "fog-lamp-rear.png",
			iconOn: "fog-lamp-rear-c.png"
		},
		"Warning Light": {
			led: "DB Warning Light",
			iconOff: "Icon_WarningLightsOff.PNG",
			iconOn: "Icon_WarningLightsOn.PNG"
		},
		"Interior Light": {
			led: "Passenger Lights",
			iconOff: "indoor-light.png",
			iconOn: "indoor-light-on.png"
		},
		"Interior Light Dim": {
			button: "Interior Light Dim",
			iconOff: "indoor-light_30pct.png",
			iconOn: "indoor-light-on_30pct.png"
		},
		"Interior Light Full": {
			button: "Interior Light Full",
			iconOff: "indoor-light_100pct.png",
			iconOn: "indoor-light-on_100pct.png"
		}
	};
	
	var config = lightConfig[lightName];
	
	// If no specific config, don't set icons (for lights without images yet)
	if(!config) {
		return;
	}
	
	// Set initial icon
	$SD.setImage(context, "actions/assets/" + config.iconOff);
	
	// Start tracking status - use Button State if available, otherwise LED
	if(config.button) {
		// Button-based light (e.g. Interior Light Dim)
		AddInterval(context, function() {
			UpdateButtonState(config.button, "Secondary", config.iconOff, config.iconOn, context);
		});
	} else {
		// LED-based light
		AddInterval(context, function() {
			UpdateButtonIcon(config.led, config.iconOn, config.iconOff, context);
		});
	}
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Wiper Up Action

function UpdateWiperStatus(context) {
	// Display current wiper level
	var levelText = "WIPER\n" + GlobalWiperLevel;
	
	if(GlobalCurrentState[context] != levelText) {
		GlobalCurrentState[context] = levelText;
		$SD.setTitle(context, levelText);
	}
}

WiperUpAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=WiperUp");
	$SD.setImage(context, "actions/assets/wiper-c.png");
	setTimeout(() => {
		$SD.setImage(context, "actions/assets/wiper.png");
	}, 200);
});

WiperUpAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	$SD.setImage(context, "actions/assets/wiper.png");
	AddInterval(context, function() { UpdateWiperStatus(context); });
});

WiperUpAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Wiper Down Action

WiperDownAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=WiperDown");
	$SD.setImage(context, "actions/assets/wiper-c.png");
	setTimeout(() => {
		$SD.setImage(context, "actions/assets/wiper.png");
	}, 200);
});

WiperDownAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	$SD.setImage(context, "actions/assets/wiper.png");
	AddInterval(context, function() { UpdateWiperStatus(context); });
});

WiperDownAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Horn Action

var HornInterval = null;

HornAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Start continuous horn
	if(!HornInterval) {
		SendTelemetryAction("/sendeventpress?event=Horn");
		HornInterval = setInterval(() => {
			SendTelemetryAction("/sendeventpress?event=Horn");
		}, 50); // Send every 50ms while held
	}
});

HornAction.onKeyUp(({ action, context, device, event, payload }) => {
	// Stop continuous horn
	if(HornInterval) {
		clearInterval(HornInterval);
		HornInterval = null;
	}
});

HornAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// High Beam Flasher Action (Hold to activate)

var HighBeamInterval = null;

HighBeamFlasherAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Start continuous high beam
	if(!HighBeamInterval) {
		SendTelemetryAction("/sendeventpress?event=High Beam Flasher On");
		HighBeamInterval = setInterval(() => {
			SendTelemetryAction("/sendeventpress?event=High Beam Flasher On");
		}, 50); // Send every 50ms while held
	}
});

HighBeamFlasherAction.onKeyUp(({ action, context, device, event, payload }) => {
	// Stop continuous high beam
	if(HighBeamInterval) {
		clearInterval(HighBeamInterval);
		HighBeamInterval = null;
	}
});

HighBeamFlasherAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	AddInterval(context, function() { UpdateButtonIcon("HeadLight Beam On", "passing-c.png", "passing.png", context); });
});

HighBeamFlasherAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
	if(HighBeamInterval) {
		clearInterval(HighBeamInterval);
		HighBeamInterval = null;
	}
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Fixing Brake Toggle Action

FixingBrakeToggleAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=FixingBrake");
});

FixingBrakeToggleAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Infos Action (Display Only - Window Heating, Mirror Heating, Stop Request)

InfosAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Display only - no action on click
});

InfosAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	// Start polling for selected info display
	var selection = payload.settings.InfosSelector;
	if(selection) {
		AddInterval(context, function() { UpdateInfoDisplay(context, selection); });
	}
});

InfosAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.infos", ({context, payload}) => {
	var selection = payload.settings.InfosSelector;
	if(!selection) {
		selection = "Window Heating";
		payload.settings.InfosSelector = "Window Heating";
		$SD.setSettings(context, payload.settings);
	}
	
	// Update display immediately when settings change
	UpdateInfoDisplay(context, selection);
});

function UpdateInfoDisplay(context, selection) {
	if(!selection) return;
	
	switch(selection) {
		case "Window Heating":
			UpdateButtonState("Window Heating", "Secondary", "Icon_Button_Off.png", "Icon_Button_On.png", context);
			break;
		case "Mirror Heating":
			UpdateButtonState("Mirror Heating", "Secondary", "Icon_Button_Off.png", "Icon_Button_On.png", context);
			break;
		case "Stop Request":
			UpdateButtonIcon("Stop Request", "Haltestelle_ON.png", "Haltestelle.png", context);
			break;
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Fuel Display Action

FuelAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Display only - no action
});

FuelAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	AddInterval(context, function() { UpdateFuelDisplay(context); });
});

FuelAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

function UpdateFuelDisplay(context) {
	var currentFuel = Math.round(GlobalCurrentFuel);
	var maxFuel = Math.round(GlobalMaxFuel);
	var percentage = maxFuel > 0 ? Math.round((GlobalCurrentFuel / GlobalMaxFuel) * 100) : 0;
	var warning = GlobalLowFuelWarning ? " ⚠️" : "";
	
	var displayText = "FUEL\n" + currentFuel + " L\n" + percentage + "%" + warning;
	$SD.setTitle(context, displayText);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Passengers Action (Dropdown for Passengers and Doors Info)

PassengersAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Display only - no action on click
});

PassengersAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	var selection = payload.settings.PassengersSelector || "Occupied Seats";
	
	// Store selection in global object
	if(!ButtonSettings[context]) {
		ButtonSettings[context] = {};
	}
	ButtonSettings[context].PassengersSelector = selection;
	
	// Start interval - it will read from ButtonSettings dynamically
	AddInterval(context, function() {
		var currentSelection = ButtonSettings[context] ? ButtonSettings[context].PassengersSelector : "Occupied Seats";
		UpdatePassengersDisplay(context, currentSelection);
	});
});

PassengersAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
	delete ButtonSettings[context];
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.passengers", ({context, payload}) => {
	var selection = payload.settings.PassengersSelector || "Occupied Seats";
	
	// Update stored selection in ButtonSettings
	if(!ButtonSettings[context]) {
		ButtonSettings[context] = {};
	}
	ButtonSettings[context].PassengersSelector = selection;
	
	// Update display immediately
	UpdatePassengersDisplay(context, selection);
});

function UpdatePassengersDisplay(context, selection) {
	if(!selection) return;
	
	var displayText = "";
	
	switch(selection) {
		case "Occupied Seats":
			displayText = "SEATS\n" + GlobalNumOccupiedSeats + " / " + GlobalNumSeats;
			break;
		case "Total Seats":
			displayText = "TOTAL\nSEATS\n" + GlobalNumSeats;
			break;
		case "Passenger Load":
			var loadPercent = Math.round(GlobalLoad * 100);
			displayText = "PASSENGER\nLOAD\n" + loadPercent + "%";
			break;
		case "Total Mass":
			var massKg = Math.round(GlobalMass);
			displayText = "TOTAL\nMASS\n" + massKg + " kg";
			break;
		case "Doors Open":
			displayText = "DOORS\nOPEN\n" + GlobalDoorsOpen;
			break;
		case "Passenger Doors":
			var passengerStatus = GlobalPassengerDoorsOpen ? "OPEN" : "CLOSED";
			displayText = "PASSENGER\nDOORS\n" + passengerStatus;
			break;
		case "Luggage Doors":
			var luggageStatus = GlobalLuggageDoorsOpen ? "OPEN" : "CLOSED";
			displayText = "LUGGAGE\nDOORS\n" + luggageStatus;
			break;
		default:
			displayText = "SELECT\nOPTION";
	}
	
	$SD.setTitle(context, displayText);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Engine Info Action (Dropdown for Engine and Driving Info)

EngineInfoAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Display only - no action on click
});

EngineInfoAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	var selection = payload.settings.EngineSelector || "Engine Status";
	
	// Store selection in global object
	if(!ButtonSettings[context]) {
		ButtonSettings[context] = {};
	}
	ButtonSettings[context].EngineSelector = selection;
	
	// Start interval - it will read from ButtonSettings dynamically
	AddInterval(context, function() {
		var currentSelection = ButtonSettings[context] ? ButtonSettings[context].EngineSelector : "Engine Status";
		UpdateEngineInfoDisplay(context, currentSelection);
	});
});

EngineInfoAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
	// Clean up stored settings
	delete ButtonSettings[context];
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.engineinfo", ({context, payload}) => {
	var selection = payload.settings.EngineSelector || "Engine Status";
	
	// Update stored selection in ButtonSettings
	if(!ButtonSettings[context]) {
		ButtonSettings[context] = {};
	}
	ButtonSettings[context].EngineSelector = selection;
	
	// Restart interval to ensure it picks up the new selection
	RemoveInterval(context);
	AddInterval(context, function() {
		var currentSelection = ButtonSettings[context] ? ButtonSettings[context].EngineSelector : "Engine Status";
		UpdateEngineInfoDisplay(context, currentSelection);
	});
	
	// Update display immediately
	UpdateEngineInfoDisplay(context, selection);
});

function UpdateEngineInfoDisplay(context, selection) {
	if(!selection) return;
	
	var displayText = "";
	
	switch(selection) {
		case "Engine Status":
			var engineStatus = GlobalEngineStarted ? "RUNNING" : "OFF";
			displayText = "ENGINE\n" + engineStatus;
			break;
		case "Ignition":
			var ignitionStatus = GlobalIgnitionEnabled ? "ON" : "OFF";
			displayText = "IGNITION\n" + ignitionStatus;
			break;
		case "RPM":
			var rpm = Math.round(GlobalRPM);
			displayText = "RPM\n" + rpm;
			break;
		case "Engine Temperature":
			var tempPercent = Math.round(GlobalEngineTemperature * 100);
			displayText = "ENGINE\nTEMP\n" + tempPercent + "%";
			break;
		case "Throttle":
			var throttlePercent = Math.round(GlobalThrottle * 100);
			displayText = "THROTTLE\n" + throttlePercent + "%";
			break;
		case "Gearbox":
			var gear = GlobalGearbox || "N";
			displayText = "GEAR\n" + gear;
			break;
		case "Brake":
			var brakePercent = Math.round(GlobalBrake * 100);
			displayText = "BRAKE\n" + brakePercent + "%";
			break;
		case "Cruise Control":
			var cruiseStatus = GlobalCruiseControlActive ? "ACTIVE" : "OFF";
			displayText = "CRUISE\nCONTROL\n" + cruiseStatus;
			break;
		default:
			displayText = "SELECT\nOPTION";
	}
	
	$SD.setTitle(context, displayText);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Speed Display Action

SpeedDisplayAction.onKeyDown(({ action, context, device, event, payload }) => {
	// Display only - no action
});

SpeedDisplayAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	AddInterval(context, function() { UpdateSpeedDisplay(context); });
});

SpeedDisplayAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

function UpdateSpeedDisplay(context) {
	var speed = Math.round(GlobalSpeed);
	var allowedSpeed = Math.round(GlobalAllowedSpeed);
	
	// Determine icon based on ALLOWED speed (rounded to nearest 10)
	var iconName = "speed_QUESTION.png";
	if(allowedSpeed !== undefined && allowedSpeed >= 0) {
		var roundedSpeed = Math.floor(allowedSpeed / 10) * 10;
		if(roundedSpeed > 120) roundedSpeed = 120;
		iconName = "speed_" + String(roundedSpeed).padStart(3, '0') + ".png";
	}
	
	$SD.setImage(context, "actions/assets/" + iconName);
	
	// Display only speed number
	var displayText = speed + " km/h";
	$SD.setTitle(context, displayText);
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Stop Brake Action

StopBrakeAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=StopBrakeOnOff");
});

StopBrakeAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	AddInterval(context, function() { UpdateButtonIcon("LED Stop Brake", "HaltestelleBremse_on.png", "HaltestelleBremse.png", context); });
});

StopBrakeAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Kneeling/Lifting Control Action

KneelingLiftAction.onKeyDown(({ action, context, device, event, payload }) => {
	var selection = payload.settings.KneelingSelector;
	if(!selection) {
		selection = "Kneeling Toggle";
	}
	
	// Get current toggle state (default to first event)
	var toggleState = payload.settings.ToggleState || "first";
	var eventName = "";
	var newImage = "";
	
	if(selection === "Kneeling Toggle") {
		// Toggle between KneelDown and KneelUp
		if(toggleState === "first") {
			eventName = "KneelDown";
			payload.settings.ToggleState = "second";
			newImage = "actions/assets/kneeling-on.png";  // activated (down)
		} else {
			eventName = "KneelUp";
			payload.settings.ToggleState = "first";
			newImage = "actions/assets/kneeling.png";  // deactivated (up)
		}
	} else if(selection === "Kneel Down") {
		// Direct kneel down event
		eventName = "KneelDown";
		newImage = "actions/assets/kneeling-on.png";
	} else if(selection === "Kneel Up") {
		// Direct kneel up event
		eventName = "KneelUp";
		newImage = "actions/assets/kneeling.png";
	} else if(selection === "Lifting Toggle") {
		// Toggle between LiftUp and LiftDown
		if(toggleState === "first") {
			eventName = "LiftUp";
			payload.settings.ToggleState = "second";
			newImage = "actions/assets/lifting-on.png";  // activated (up)
		} else {
			eventName = "LiftDown";
			payload.settings.ToggleState = "first";
			newImage = "actions/assets/lifting.png";  // deactivated (down)
		}
	} else if(selection === "Lift Up") {
		// Direct lift up event
		eventName = "LiftUp";
		newImage = "actions/assets/lifting-on.png";
	} else if(selection === "Lift Down") {
		// Direct lift down event
		eventName = "LiftDown";
		newImage = "actions/assets/lifting.png";
	} else if(selection === "Lift Reset") {
		// Toggle between LiftReset_Button and ResetLiftReset
		if(toggleState === "first") {
			eventName = "LiftReset_Button";
			payload.settings.ToggleState = "second";
		} else {
			eventName = "ResetLiftReset";
			payload.settings.ToggleState = "first";
		}
	}
	
	// Save toggle state
	$SD.setSettings(context, payload.settings);
	
	// Update image if applicable
	if(newImage) {
		$SD.setImage(context, newImage);
	}
	
	// Send event
	SendTelemetryAction("/sendeventpress?event=" + eventName);
});

KneelingLiftAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.kneelinglift", ({context, payload}) => {
	var selection = payload.settings.KneelingSelector;
	if(!selection) {
		selection = "Kneeling Toggle";
		payload.settings.KneelingSelector = "Kneeling Toggle";
		$SD.setSettings(context, payload.settings);
	}
	
	// Reset toggle state when selection changes
	if(payload.settings.LastSelection !== selection) {
		payload.settings.ToggleState = "first";
		payload.settings.LastSelection = selection;
		$SD.setSettings(context, payload.settings);
	}
	
	// Set image and text based on selection and current state
	var toggleState = payload.settings.ToggleState || "first";
	var buttonText = "";
	var imagePath = "";
	
	if(selection === "Kneeling Toggle") {
		buttonText = (toggleState === "first") ? "KNEEL ↓" : "KNEEL ↑";
		imagePath = (toggleState === "first") ? "actions/assets/kneeling.png" : "actions/assets/kneeling-on.png";
	} else if(selection === "Kneel Down") {
		buttonText = "KNEEL ↓";
		imagePath = "actions/assets/kneeling-on.png";
	} else if(selection === "Kneel Up") {
		buttonText = "KNEEL ↑";
		imagePath = "actions/assets/kneeling.png";
	} else if(selection === "Lifting Toggle") {
		buttonText = (toggleState === "first") ? "LIFT ↑" : "LIFT ↓";
		imagePath = (toggleState === "first") ? "actions/assets/lifting.png" : "actions/assets/lifting-on.png";
	} else if(selection === "Lift Up") {
		buttonText = "LIFT ↑";
		imagePath = "actions/assets/lifting-on.png";
	} else if(selection === "Lift Down") {
		buttonText = "LIFT ↓";
		imagePath = "actions/assets/lifting.png";
	} else if(selection === "Lift Reset") {
		buttonText = (toggleState === "first") ? "RESET 1" : "RESET 2";
	}
	
	// Check if user wants to show status info (default: true)
	var showStatus = payload.settings.ShowStatus;
	if(showStatus === undefined) {
		showStatus = true;
	}
	
	// Update image if applicable
	if(imagePath) {
		$SD.setImage(context, imagePath);
	}
	
	// Only show status text if checkbox is enabled
	if(showStatus) {
		$SD.setTitle(context, buttonText);
	} else {
		$SD.setTitle(context, "");
	}
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Climate Control Action

ClimateControlAction.onKeyDown(({ action, context, device, event, payload }) => {
	var selection = payload.settings.ClimateSelector;
	if(!selection) {
		selection = "Air Condition Toggle";
	}
	
	// Display-only options don't trigger events
	var displayOptions = ["Fan Speed Display", "Driver Temp Display", "AC Temp Display"];
	if(displayOptions.includes(selection)) {
		return; // Just display, don't send event
	}
	
	var eventMapping = {
		"Air Condition Toggle": "ToggleAirCondition",
		"Temperature Up": "AirconditionPlus",
		"Temperature Down": "AirconditionMinus",
		"Airflow Toggle": "ToggleAirconAirflow",
		"Airflow Left": "AirCon AirflowFakeLeft",
		"Airflow Right": "AirCon AirflowFakeRight",
		"Climate Mode": "ToggleAirconMode1"
	};
	
	var eventName = eventMapping[selection] || "ToggleAirCondition";
	SendTelemetryAction("/sendeventpress?event=" + eventName);
});

ClimateControlAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	// Start polling for display options
	var selection = payload.settings.ClimateSelector;
	var displayOptions = ["Fan Speed Display", "Driver Temp Display", "AC Temp Display"];
	if(displayOptions.includes(selection)) {
		// Immediately show current value
		UpdateClimateDisplay(context, selection, payload.settings);
		// Start polling for updates
		AddInterval(context, function() { UpdateClimateDisplay(context, selection, payload.settings); });
	}
});

ClimateControlAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.climatecontrol", ({context, payload}) => {
	var selection = payload.settings.ClimateSelector;
	if(!selection) {
		selection = "Air Condition Toggle";
		payload.settings.ClimateSelector = "Air Condition Toggle";
		$SD.setSettings(context, payload.settings);
	}
	
	// Check if user wants to show temperature info
	var showTemperature = payload.settings.ShowTemperature;
	if(showTemperature === undefined) {
		showTemperature = true; // Default to showing temperature
	}
	
	// Check if this is a display option
	var displayOptions = ["Fan Speed Display", "Driver Temp Display", "AC Temp Display"];
	if(displayOptions.includes(selection)) {
		// For display options, update the display immediately
		UpdateClimateDisplay(context, selection, payload.settings);
	} else {
		// For control options, set static text
		var textMapping = {
			"Air Condition Toggle": "AC",
			"Temperature Up": "TEMP +",
			"Temperature Down": "TEMP -",
			"Airflow Toggle": "AIRFLOW",
			"Airflow Left": "AIR ←",
			"Airflow Right": "AIR →",
			"Climate Mode": "START"
		};
		
		var buttonText = textMapping[selection] || "AC";
		
		// Only show text if checkbox is enabled
		if(showTemperature) {
			$SD.setTitle(context, buttonText);
		} else {
			$SD.setTitle(context, "");
		}
	}
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Window Control Action

WindowControlAction.onKeyDown(({ action, context, device, event, payload }) => {
	var selection = payload.settings.WindowSelector;
	if(!selection) {
		selection = "Driver Window Open";
	}
	
	var eventMapping = {
		"Driver Window Open": "DriverWindowOpen",
		"Driver Window Close": "DriverWindowClose",
		"Window Shade Up": "WindowShadeUp",
		"Window Shade Down": "WindowShadeDown",
		"Window Shade Side Up": "WindowShadeSideUp",
		"Window Shade Side Down": "WindowShadeSideDown"
	};
	
	var iconMapping = {
		"Driver Window Open": "actions/assets/window-left-down.png",
		"Driver Window Close": "actions/assets/window-left-up.png"
	};
	
	// Set icon if available
	if(iconMapping[selection]) {
		$SD.setImage(context, iconMapping[selection]);
	}
	
	var eventName = eventMapping[selection] || "DriverWindowOpen";
	SendTelemetryAction("/sendeventpress?event=" + eventName);
});

WindowControlAction.onKeyUp(({ action, context, device, event, payload }) => {
	var selection = payload.settings.WindowSelector;
	if(!selection) {
		selection = "Driver Window Open";
	}
	
	var eventMapping = {
		"Driver Window Open": "DriverWindowOpen",
		"Driver Window Close": "DriverWindowClose",
		"Window Shade Up": "WindowShadeUp",
		"Window Shade Down": "WindowShadeDown",
		"Window Shade Side Up": "WindowShadeSideUp",
		"Window Shade Side Down": "WindowShadeSideDown"
	};
	
	var eventName = eventMapping[selection] || "DriverWindowOpen";
	SendTelemetryAction("/sendeventrelease?event=" + eventName);
});

WindowControlAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	var selection = payload.settings.WindowSelector || "Driver Window Open";
	var iconMapping = {
		"Driver Window Open": "actions/assets/window-left-down.png",
		"Driver Window Close": "actions/assets/window-left-up.png"
	};
	
	if(iconMapping[selection]) {
		$SD.setImage(context, iconMapping[selection]);
	}
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.windowcontrol", ({context, payload}) => {
	var selection = payload.settings.WindowSelector;
	if(!selection) {
		selection = "Driver Window Open";
		payload.settings.WindowSelector = "Driver Window Open";
		$SD.setSettings(context, payload.settings);
	}
	
	var iconMapping = {
		"Driver Window Open": "actions/assets/window-left-down.png",
		"Driver Window Close": "actions/assets/window-left-up.png"
	};
	
	if(iconMapping[selection]) {
		$SD.setImage(context, iconMapping[selection]);
	}
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Pantograph On Action

PantographOnAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=Activate Pantograph");
});

PantographOnAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	// Start tracking Pantograph status (Secondary = Extended/On)
	AddInterval(context, function() { UpdateButtonState("Pantograph", "Secondary", "Icon_Button_Off.png", "Icon_Button_On.png", context); });
});

PantographOnAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Pantograph Off Action

PantographOffAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=Deactivate Pantograph");
});

PantographOffAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	// Start tracking Pantograph status (Primary = Retracted/Off)
	AddInterval(context, function() { UpdateButtonState("Pantograph", "Primary", "Icon_Button_Off.png", "Icon_Button_On.png", context); });
});

PantographOffAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Camera Switch Action

CameraSwitchAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=SwitchCamera");
});

CameraSwitchAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// USB Clearance Action

USBClearanceAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=ToggleUSB");
});

USBClearanceAction.onWillAppear(({ action, context, device, event, payload }) => {
	// Set initial icon
	$SD.setImage(context, "actions/assets/USB.png");
	
	// Start tracking USB Clearance status
	AddInterval(context, function() { UpdateButtonIcon("USB_Clearance", "USB_on.png", "USB.png", context); });
});

USBClearanceAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Wheelchair Request Action

WheelchairRequestAction.onKeyDown(({ action, context, device, event, payload }) => {
	SendTelemetryAction("/sendeventpress?event=WheelchairRequest");
});

WheelchairRequestAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Stop Request Action (Display only - no events)

StopRequestAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	AddInterval(context, function() { UpdateStopRequestStatus(context); });
});

StopRequestAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// LED Monitor Action (Display only - monitors any LED status)

LEDMonitorAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
	
	var selection = payload.settings.LEDSelect || "Dashboard Brake Assist";
	
	// Store selection in ButtonSettings for dynamic access
	if(!ButtonSettings[context]) {
		ButtonSettings[context] = {};
	}
	ButtonSettings[context].LEDSelect = selection;
	
	// Start interval - it will read from ButtonSettings dynamically
	AddInterval(context, function() { 
		var currentSelection = ButtonSettings[context] ? ButtonSettings[context].LEDSelect : "Dashboard Brake Assist";
		UpdateLEDMonitor(currentSelection, context); 
	});
});

LEDMonitorAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
	delete ButtonSettings[context];
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.ledmonitor", ({context, payload}) => {
	var selection = payload.settings.LEDSelect;
	if(!selection) {
		selection = "Dashboard Brake Assist";
		payload.settings.LEDSelect = "Dashboard Brake Assist";
		$SD.setSettings(context, payload.settings);
	}
	
	// Update stored selection in ButtonSettings
	if(!ButtonSettings[context]) {
		ButtonSettings[context] = {};
	}
	ButtonSettings[context].LEDSelect = selection;
});

function UpdateLEDMonitor(ledName, context) {
	if(!GlobalLampData || !GlobalLampData.AllLamps) return;
	
	var ledValue = GlobalLampData.AllLamps[ledName];
	
	// LEDs are 0.0 = OFF, >= 0.5 = ON
	if(ledValue >= 0.5) {
		$SD.setImage(context, "actions/assets/Icon_Button_On.png");
	} else {
		$SD.setImage(context, "actions/assets/Icon_Button_Off.png");
	}
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Light Switch Action (6 positions: Off/Parking/Headlights/High Beam/Fog Front/Fog Rear)

LightSwitchAction.onKeyDown(({ action, context, device, event, payload }) => {
	var mode = payload.settings.LightSwitchMode || "Up";
	
	if(mode === "Up") {
		SendTelemetryAction("/sendeventpress?event=LightSwitchUp");
	} else if(mode === "Down") {
		SendTelemetryAction("/sendeventpress?event=LightSwitchDown");
	}
	// Status mode doesn't send anything
});

LightSwitchAction.onKeyUp(({ action, context, device, event, payload }) => {
	var mode = payload.settings.LightSwitchMode || "Up";
	
	if(mode === "Up") {
		SendTelemetryAction("/sendeventrelease?event=LightSwitchUp");
	} else if(mode === "Down") {
		SendTelemetryAction("/sendeventrelease?event=LightSwitchDown");
	}
});

LightSwitchAction.onWillAppear(({ action, context, device, event, payload }) => {
	$SD.getSettings(context);
});

LightSwitchAction.onWillDisappear(({ action, context, device, event, payload }) => {
	RemoveInterval(context);
});

$SD.onDidReceiveSettings("de.blackmautz.telemetry.mercedes.lightswitchv2", ({context, payload}) => {
	RemoveInterval(context);
	
	var mode = payload.settings.LightSwitchMode;
	if(mode === undefined) {
		mode = "Status";
		payload.settings.LightSwitchMode = "Status";
		$SD.setSettings(context, payload.settings);
	}
	
	// FORCE set image to ON to test if icons work at all
	$SD.setImage(context, "actions/assets/Icon_Headlight_On.png");
	
	// Update icon periodically
	AddInterval(context, function() {
		if(!GlobalButtonData) return;
		
		var button = GlobalButtonData.find(b => b.Name === "Light Switch");
		if(button) {
			var iconPath = "actions/assets/Icon_Headlight_Off.png";
			
			// Off = OFF icon, everything else = ON icon
			if(button.State !== "Off") {
				iconPath = "actions/assets/Icon_Headlight_On.png";
			}
			
			if(GlobalCurrentState[context] != iconPath) {
				GlobalCurrentState[context] = iconPath;
				$SD.setImage(context, iconPath);
			}
		}
	});
});



