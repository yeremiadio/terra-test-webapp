export interface IIodata {
  [key: string]: number;
}

export interface IIodataParams {
  [key: string]: string;
}

export interface IGpsData {
  imei: string;
  location: string;
  lng: number;
  lat: number;
  date: string;
  altitude: number;
  speed: number;
  angle: number;
  status_mesin: string;
  iodata: IIodata;
}

export interface IGpsDashboardMetrics {
  totalOdometerSum: { value: number; unit: string };
  averageBatteryVoltage: { value: number; unit: string };
  gsmSignalDistribution: Record<string, number>;
  gnssFix: { good: number; bad: number };
  totalRecordsProcessed: number;
}
