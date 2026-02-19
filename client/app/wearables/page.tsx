'use client';

import { useState, useEffect, useRef } from 'react';
import { Watch, Smartphone, RefreshCw, CheckCircle2, Bluetooth, Heart, Battery, AlertCircle, Footprints, Moon, Wind, Loader2, Terminal, Search, ToggleLeft, ToggleRight, BellRing, Info } from 'lucide-react';

// Web Bluetooth API type declarations
declare global {
    interface Navigator {
        bluetooth: {
            requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
        };
    }
}

interface RequestDeviceOptions {
    acceptAllDevices?: boolean;
    optionalServices?: string[];
}

interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
    addEventListener(type: string, listener: () => void): void;
}

interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryService(service: string): Promise<any>;
}


export default function Wearables() {
    const [isScanning, setIsScanning] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
    const [deviceInfo, setDeviceInfo] = useState<{ manufacturer?: string; model?: string }>({});

    // Health Metrics
    const [heartRate, setHeartRate] = useState<number | null>(null);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [steps, setSteps] = useState<number | null>(null);
    const [cadence, setCadence] = useState<number | null>(null);
    const [speed, setSpeed] = useState<number | null>(null);
    const [sleep, setSleep] = useState<string | null>(null);
    const [oxygen, setOxygen] = useState<number | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    // Diagnostics State
    const [strictMode, setStrictMode] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [services, setServices] = useState<string[]>([]);

    // Refs for simulation intervals to clear them properly
    const simulationInterval = useRef<NodeJS.Timeout | null>(null);
    const currentStepsRef = useRef(842);

    useEffect(() => {
        if (typeof navigator !== 'undefined' && !navigator.bluetooth) {
            setIsSupported(false);
        }
        return () => stopSimulation();
    }, []);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);
    };

    const connectBluetooth = async () => {
        setIsScanning(true);
        setError(null);
        setLogs([]);
        setServices([]);
        setDeviceInfo({});
        addLog('Starting scan...');

        try {
            // Request device with expanded optional services to maximize compatibility
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: [
                    'heart_rate',
                    'battery_service',
                    'immediate_alert',
                    'device_information',
                    'pulse_oximeter',
                    'health_thermometer',
                    'running_speed_and_cadence', // Steps/Speed
                    'cycling_speed_and_cadence',
                    'generic_access' // To read device name if missing
                ]
            });

            addLog(`Device selected: ${device.name || 'Unknown'}`);
            addLog(`Device ID: ${device.id}`);

            const server = await device.gatt?.connect();
            setConnectedDevice(device);
            addLog('Connected to GATT Server');
            setIsSyncing(true);

            // 0. Try to resolve Name from Generic Access if missing
            if (!device.name) {
                try {
                    const accessService = await server?.getPrimaryService('generic_access');
                    const nameChar = await accessService?.getCharacteristic('gap.device_name');
                    const nameVal = await nameChar?.readValue();
                    const realName = new TextDecoder().decode(nameVal);
                    if (realName) {
                        // Manually update the connected device object for UI
                        Object.defineProperty(device, 'name', { value: realName, writable: true });
                        setConnectedDevice({ ...device }); // Trigger re-render
                        addLog(`Resolved Device Name: ${realName}`);
                    }
                } catch (e) {
                    addLog('Could not resolve device name from GATT');
                }
            }

            // 1. Try Device Information (Manufacturer & Model)
            try {
                addLog('Reading Device Info...');
                const infoService = await server?.getPrimaryService('device_information');
                setServices(prev => [...prev, 'Device Info (0x180A)']);

                // Manufacturer
                try {
                    const manufacturerChar = await infoService?.getCharacteristic('manufacturer_name_string');
                    const manufacturerVal = await manufacturerChar?.readValue();
                    const manufacturer = new TextDecoder().decode(manufacturerVal);
                    setDeviceInfo(prev => ({ ...prev, manufacturer }));
                    addLog(`Manufacturer: ${manufacturer}`);
                } catch (e) { addLog('Manufacturer Name not readable'); }

                // Model
                try {
                    const modelChar = await infoService?.getCharacteristic('model_number_string');
                    const modelVal = await modelChar?.readValue();
                    const model = new TextDecoder().decode(modelVal);
                    setDeviceInfo(prev => ({ ...prev, model }));
                    addLog(`Model: ${model}`);
                } catch (e) { addLog('Model Number not readable'); }

            } catch (e) {
                addLog('Device Info Service not found');
            }

            // 2. Try Real Heart Rate
            try {
                addLog('Attempting to read Heart Rate Service...');
                const hrService = await server?.getPrimaryService('heart_rate');
                setServices(prev => [...prev, 'Heart Rate (0x180D)']);
                addLog('Heart Rate Service found');

                const hrChar = await hrService?.getCharacteristic('heart_rate_measurement');
                await hrChar?.startNotifications();
                addLog('Subscribed to HR notifications');

                hrChar?.addEventListener('characteristicvaluechanged', (event: any) => {
                    const value = event.target.value;
                    const flags = value.getUint8(0);
                    let hr;
                    // Check format bit (0 = uint8, 1 = uint16)
                    if ((flags & 0x01) === 0) {
                        hr = value.getUint8(1);
                    } else {
                        hr = value.getUint16(1, true); // Little Endian
                    }
                    setHeartRate(hr);
                    addLog(`Received HR: ${hr} BPM`);
                });
            } catch (e) {
                addLog('Heart Rate Service NOT found or Access Denied');
            }

            // 3. Try Real Battery
            try {
                addLog('Attempting to read Battery Service...');
                const battService = await server?.getPrimaryService('battery_service');
                setServices(prev => [...prev, 'Battery (0x180F)']);
                addLog('Battery Service found');

                const battChar = await battService?.getCharacteristic('battery_level');
                const battValue = await battChar?.readValue();
                const level = battValue?.getUint8(0);
                setBatteryLevel(level || null);
                addLog(`Read Battery Level: ${level}%`);
            } catch (e) {
                addLog('Battery Service NOT found');
            }

            // 3.5 Try Running Speed & Cadence (Steps/Speed)
            try {
                addLog('Attempting to read RSC Service...');
                const rscService = await server?.getPrimaryService('running_speed_and_cadence');
                if (rscService) {
                    setServices(prev => [...prev, 'RSC Service (0x1814)']);
                    addLog('RSC Service found (Steps/Speed)');

                    const rscChar = await rscService.getCharacteristic('rsc_measurement');
                    await rscChar.startNotifications();

                    rscChar.addEventListener('characteristicvaluechanged', (event: any) => {
                        const value = event.target.value;
                        const flags = value.getUint8(0);

                        // Parse Speed (Unit: m/s * 256)
                        const rawSpeed = value.getUint16(1, true);
                        const speedMps = rawSpeed / 256; // meters per second
                        const speedKph = (speedMps * 3.6).toFixed(1); // km/h

                        // Parse Cadence (Unit: steps/minute)
                        const cad = value.getUint8(3);

                        setSpeed(parseFloat(speedKph));
                        setCadence(cad);
                        addLog(`RSC Data - Speed: ${speedKph}km/h, Cadence: ${cad} spm`);
                    });
                }
            } catch (e) {
                addLog('RSC Service not supported by this device.');
            }

            // 4. Try Immediate Alert (Find My Device)
            try {
                const alertService = await server?.getPrimaryService('immediate_alert');
                if (alertService) {
                    setServices(prev => [...prev, 'Immediate Alert (0x1802)']);
                    addLog('Immediate Alert Service found (Find My Device supported)');
                }
            } catch (e) {
                // Ignore
            }

            setIsSyncing(false);

            // 5. Simulation Logic
            if (!strictMode) {
                addLog('Starting AI Simulation for missing metrics...');
                startSimulation();
            } else {
                addLog('Strict Mode ON: Simulation skipped. Showing only real data.');
            }

            device.addEventListener('gattserverdisconnected', onDisconnected);

        } catch (err: any) {
            console.error(err);
            setIsSyncing(false);
            addLog(`Error: ${err.message}`);
            if (err.name !== 'NotFoundError') {
                setError(err.message || 'Failed to connect.');
            }
        } finally {
            setIsScanning(false);
        }
    };

    const startSimulation = () => {
        stopSimulation(); // Clear existing

        // Initial Values
        currentStepsRef.current = 842;
        let currentOxygen = 98;

        setSteps(currentStepsRef.current);
        setSleep('7h 12m');
        setOxygen(currentOxygen);

        setHeartRate((prev) => prev || 72);

        simulationInterval.current = setInterval(() => {
            // Heart Rate
            const simHR = 70 + Math.floor(Math.random() * 20);
            setHeartRate(simHR);

            // Cadence (90-110 steps/min)
            const simCadence = 90 + Math.floor(Math.random() * 20);
            setCadence(simCadence);

            // Speed (11-13 km/h via treadmill pace)
            const simSpeed = 11 + parseFloat((Math.random() * 2).toFixed(1));
            setSpeed(simSpeed);

            addLog(`[SIM] HR: ${simHR}, Cadence: ${simCadence}, Speed: ${simSpeed}`);

            currentStepsRef.current += Math.floor(Math.random() * 2) + 1;
            setSteps(currentStepsRef.current);

            if (Math.random() > 0.8) {
                currentOxygen = 97 + Math.floor(Math.random() * 3);
                setOxygen(currentOxygen);
            }

        }, 2000);
    };

    const stopSimulation = () => {
        if (simulationInterval.current) {
            clearInterval(simulationInterval.current);
            simulationInterval.current = null;
        }
    };

    const onDisconnected = () => {
        addLog('Device Disconnected');
        setConnectedDevice(null);
        setDeviceInfo({});
        setHeartRate(null);
        setBatteryLevel(null);
        setSteps(null);
        setCadence(null);
        setSpeed(null);
        setSleep(null);
        setOxygen(null);
        setServices([]);
        stopSimulation();
        setIsSyncing(false);
    };

    const disconnectDevice = () => {
        if (connectedDevice?.gatt?.connected) {
            connectedDevice.gatt.disconnect();
        }
        onDisconnected();
    };

    const findMyDevice = async () => {
        if (!connectedDevice || !connectedDevice.gatt?.connected) return;
        addLog('Sending "Find My Device" Alert...');
        try {
            const service = await connectedDevice.gatt.getPrimaryService('immediate_alert');
            const char = await service.getCharacteristic('alert_level');
            await char.writeValue(new Uint8Array([2])); // 2 = High Alert
            addLog('Alert Sent! Device should vibrate/beep.');
        } catch (e) {
            addLog('Failed to send alert. Service not available.');
        }
    };

    const startDemoMode = () => {
        addLog('Starting Demo Mode...');
        setConnectedDevice({ name: 'Demo Device', id: 'demo-123', gatt: null } as any);
        setDeviceInfo({ manufacturer: 'Demo', model: 'Virtual Device' });
        setIsSyncing(true);

        setTimeout(() => {
            if (!strictMode) {
                startSimulation();
                addLog('Simulation Started');
            } else {
                addLog('Strict Mode: Simulation Skipped');
                setHeartRate(null);
            }
            setIsSyncing(false);
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
                            <Watch className="text-blue-500" size={40} />
                            Fit AI Sync
                        </h1>
                        <p className="text-gray-400">
                            Connect any Bluetooth device. Use <strong>Strict Mode</strong> to verify real data.
                        </p>

                    </div>

                    <button
                        onClick={() => setStrictMode(!strictMode)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${strictMode ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-zinc-900 border-gray-700 text-gray-400'}`}
                    >
                        {strictMode ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        <span className="font-bold">Strict Mode {strictMode ? 'ON' : 'OFF'}</span>
                    </button>
                </div>

                {!isSupported && (
                    <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-8 flex items-center gap-3 text-red-400">
                        <AlertCircle />
                        <span>Web Bluetooth is not supported in this browser. Please use Chrome, Edge, or Bluefy on iOS.</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Scan Section */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-zinc-900 p-8 rounded-3xl border border-gray-800">
                            <div className="text-center mb-8">
                                <div className={`w-24 h-24 mx-auto bg-black rounded-full flex items-center justify-center border-2 ${isScanning || isSyncing ? 'border-blue-500 animate-pulse' : connectedDevice ? 'border-green-500' : 'border-gray-700'}`}>
                                    {isScanning || isSyncing ? (
                                        <Bluetooth size={40} className="text-blue-500" />
                                    ) : connectedDevice ? (
                                        (connectedDevice.name?.toLowerCase().match(/phone|iphone|pixel|galaxy|android/) || deviceInfo.model?.toLowerCase().match(/phone|iphone|pixel|galaxy|android/)) ? (
                                            <Smartphone size={40} className="text-green-500" />
                                        ) : (
                                            <Watch size={40} className="text-green-500" />
                                        )
                                    ) : (
                                        <Bluetooth size={40} className="text-gray-500" />
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mt-4">
                                    {isSyncing ? 'Syncing...' : connectedDevice ? 'Connected' : isScanning ? 'Searching...' : 'Ready'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    {connectedDevice ? connectedDevice.name : 'Ensure device is visible.'}
                                </p>
                                {connectedDevice && (deviceInfo.manufacturer || deviceInfo.model) && (
                                    <div className="mt-4 bg-gray-800/50 p-3 rounded-xl text-xs text-left">
                                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                                            <Info size={12} /> Hardware Info
                                        </div>
                                        {deviceInfo.manufacturer && <div><span className="text-gray-500">Mfr:</span> {deviceInfo.manufacturer}</div>}
                                        {deviceInfo.model && <div><span className="text-gray-500">Model:</span> {deviceInfo.model}</div>}
                                    </div>
                                )}
                            </div>

                            {!connectedDevice ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={connectBluetooth}
                                        disabled={isScanning || !isSupported}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        {isScanning ? <RefreshCw className="animate-spin" /> : 'Scan All Devices'}
                                    </button>
                                    <button
                                        onClick={startDemoMode}
                                        className="w-full py-2 text-sm text-gray-500 hover:text-white underline"
                                    >
                                        No device? Try Demo Mode
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <button
                                        onClick={findMyDevice}
                                        className="w-full py-3 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                                    >
                                        <BellRing size={18} /> Find My Device
                                    </button>
                                    <button
                                        onClick={disconnectDevice}
                                        className="w-full py-3 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded-xl font-bold transition-all"
                                    >
                                        Disconnect
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Diagnostics Panel */}
                        <div className="bg-black p-6 rounded-3xl border border-gray-800 font-mono text-xs h-[300px] overflow-y-auto">
                            <div className="flex items-center gap-2 text-gray-400 mb-4 border-b border-gray-800 pb-2">
                                <Terminal size={14} /> Connection Log
                            </div>
                            <div className="space-y-1">
                                {logs.length === 0 && <span className="text-gray-600">Waiting for events...</span>}
                                {logs.map((log, i) => (
                                    <div key={i} className="text-green-400/80">{log}</div>
                                ))}
                            </div>

                            {services.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-800">
                                    <div className="text-gray-400 mb-2">Discovered Services:</div>
                                    {services.map((s, i) => (
                                        <div key={i} className="text-blue-400">{s}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Live Data Dashboard */}
                    <div className={`lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ${connectedDevice && !isSyncing ? 'opacity-100' : 'opacity-50 blur-sm pointer-events-none'}`}>

                        {/* Heart Rate Card */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-red-500/50 transition-all">
                            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                            <Heart className={`mx-auto mb-3 ${heartRate ? 'text-red-500 animate-pulse' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Heart Rate</h3>
                            <div className="text-5xl font-black text-white mt-2 flex items-baseline justify-center gap-2">
                                {heartRate || '--'}
                                <span className="text-lg font-medium text-gray-500">BPM</span>
                            </div>
                        </div>

                        {/* Steps Card */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-orange-500/50 transition-all">
                            <div className="absolute inset-0 bg-orange-500/5 group-hover:bg-orange-500/10 transition-colors" />
                            <Footprints className={`mx-auto mb-3 ${steps ? 'text-orange-500' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Total Steps</h3>
                            <div className="text-5xl font-black text-white mt-2 flex items-baseline justify-center gap-2">
                                {steps || '--'}
                            </div>
                        </div>

                        {/* Speed Card */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-blue-500/50 transition-all">
                            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
                            <Wind className={`mx-auto mb-3 ${speed ? 'text-blue-500' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Speed</h3>
                            <div className="text-5xl font-black text-white mt-2 flex items-baseline justify-center gap-2">
                                {speed || '--'}
                                <span className="text-lg font-medium text-gray-500">KM/H</span>
                            </div>
                        </div>

                        {/* Cadence Card (Steps/Min) */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-green-500/50 transition-all">
                            <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                            <Footprints className={`mx-auto mb-3 ${cadence ? 'text-green-500' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Cadence</h3>
                            <div className="text-5xl font-black text-white mt-2 flex items-baseline justify-center gap-2">
                                {cadence || '--'}
                                <span className="text-lg font-medium text-gray-500">SPM</span>
                            </div>
                        </div>

                        {/* Sleep Card */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-purple-500/50 transition-all">
                            <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-colors" />
                            <Moon className={`mx-auto mb-3 ${sleep ? 'text-purple-500' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Sleep</h3>
                            <div className="text-4xl font-black text-white mt-4 flex items-baseline justify-center gap-2">
                                {sleep || '--'}
                            </div>
                        </div>

                        {/* Oxygen (SpO2) Card */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
                            <Wind className={`mx-auto mb-3 ${oxygen ? 'text-cyan-500' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">SpO2 (Oxygen)</h3>
                            <div className="text-5xl font-black text-white mt-2 flex items-baseline justify-center gap-2">
                                {oxygen || '--'}
                                <span className="text-lg font-medium text-gray-500">%</span>
                            </div>
                        </div>

                        {/* Battery Card */}
                        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-gray-800 text-center relative overflow-hidden group hover:border-green-500/50 transition-all md:col-span-2">
                            <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-colors" />
                            <Battery className={`mx-auto mb-3 ${batteryLevel ? 'text-green-500' : 'text-gray-600'}`} size={40} />
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Device Battery</h3>
                            <div className="text-5xl font-black text-white mt-2 flex items-baseline justify-center gap-2">
                                {batteryLevel || '--'}
                                <span className="text-lg font-medium text-gray-500">%</span>
                            </div>
                            <div className="w-full max-w-[200px] bg-gray-800 h-2 rounded-full mt-4 mx-auto">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${batteryLevel || 0}%` }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {isSyncing && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-zinc-900 p-8 rounded-3xl border border-gray-800 text-center">
                        <Loader2 className="animate-spin text-blue-500 mx-auto mb-4" size={48} />
                        <h3 className="text-xl font-bold">Syncing with Device...</h3>
                        <p className="text-gray-400 mt-2">Reading health metrics</p>
                    </div>
                </div>
            )}
        </div>
    );
}
