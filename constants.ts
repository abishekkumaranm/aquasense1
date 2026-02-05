
import { SourceInfo, DeviceConfig } from './types';

export const SOURCES: SourceInfo[] = [
  {
    id: 'overhead-tank',
    name: 'Overhead Tank',
    deviceId: 'AQ-OHT-001',
    location: 'Building A, Terrace',
    usageType: 'Smart Home / General Use',
    status: 'online',
    signalStrength: 85,
  },
  {
    id: 'borewell',
    name: 'Borewell',
    deviceId: 'AQ-BW-002',
    location: 'Campus Ground, East',
    usageType: 'Hostel / Auxiliary Tank',
    status: 'online',
    signalStrength: 72,
  }
];

export const DEVICE_INFO: DeviceConfig = {
  coreModule: 'ESP32-WROOM-32D',
  firmwareVersion: 'v2.4.1-stable',
  ipAddress: '192.168.1.142',
  uptime: '14d 06h 22m',
};

export const COLORS = {
  primary: '#0ea5e9', // sky-500
  secondary: '#14b8a6', // teal-500
  accent: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  danger: '#ef4444', // red-500
  neutral: '#64748b', // slate-500
};
