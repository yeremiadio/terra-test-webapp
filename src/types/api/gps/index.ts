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
  totalOdometerByImei: {
    imei: string;
    avgOdometer: number;
  }[];
  baseMetrics: MetricsSummary;
  totalRecordsProcessed: number;
}

export interface IGpsCoordinates {
  lat: number;
  lng: number;
  location: string;
  timestamp: Date;
}

export interface IGnssStatus {
  [key: string]: number;
}

export interface IGpsCoordinateParams {
  imei: string;
  startDate?: Date;
  endDate?: Date;
}

export interface MovementStats {
  totalMovingTime: number;
  totalStoppedTime: number;
  totalIdlingTime: number;
}

export interface MetricsSummary {
  totalDistance: number; // km
  totalDuration: number; // seconds
  averageSpeed: number; // km/h
  maxSpeed: number; // km/h
  minSpeed: number; // km/h
  movementStats: MovementStats;
}
