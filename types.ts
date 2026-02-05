
export type SourceId = 'overhead-tank' | 'borewell';

export interface WaterData {
  tds: number;
  turbidity: number;
  temperature: number;
  estimatedPh: number;
  healthScore: number;
  timestamp: string;
}

export interface SourceInfo {
  id: SourceId;
  name: string;
  deviceId: string;
  location: string;
  usageType: string;
  status: 'online' | 'offline';
  signalStrength: number;
}

export type Severity = 'Critical' | 'Warning' | 'Info';

export interface Alert {
  id: string;
  title: string;
  description: string;
  source: string;
  severity: Severity;
  timestamp: string;
  dismissed: boolean;
}

export interface DeviceConfig {
  coreModule: string;
  firmwareVersion: string;
  ipAddress: string;
  uptime: string;
}
