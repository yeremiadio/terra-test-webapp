import { IIodata } from '@/types/api/gps';

export const keyMap: Record<string, string> = {
  '16': 'totalOdometer',
  '21': 'gsmSignal',
  '24': 'speed',
  '30': 'numberOfDtc',
  '31': 'engineLoad',
  '32': 'coolantTemperature',
  '33': 'shortFuelTrim',
  '36': 'engineRpm',
  '37': 'vehicleSpeed',
  '38': 'timingAdvance',
  '39': 'intakeAirTemperature',
  '40': 'maf',
  '41': 'throttlePosition',
  '42': 'runtimeSinceEngineStart',
  '43': 'distanceTraveledMilOn',
  '49': 'distanceSinceCodesClear',
  '50': 'barometricPressure',
  '51': 'controlModuleVoltage',
  '53': 'ambientAirTemperature',
  '54': 'timeRunWithMilOn',
  '55': 'timeSinceCodesCleared',
  '66': 'externalVoltage',
  '67': 'batteryVoltage',
  '68': 'batteryCurrent',
  '69': 'gnssStatus',
  '181': 'gnssPdop',
  '182': 'gnssHdop',
  '200': 'sleepMode',
  '239': 'ignition',
  '240': 'movement',
  '241': 'activeGsmOperator',
  '541': 'commandedEquivalenceR',
  '759': 'fuelType',
};

const unitMap: Record<string, string> = {
  '16': 'm',
  '21': '', // Signal strength usually unitless
  '24': 'km/h', // Speed
  '30': '', // Counts don't have units
  '31': '%', // Engine load in percentage
  '32': '°C',
  '33': '%',
  '36': 'rpm',
  '37': 'km/h',
  '38': '°',
  '39': '°C',
  '40': 'g/s',
  '41': '%',
  '42': 's',
  '43': 'km',
  '49': 'km',
  '50': 'kPa',
  '51': 'V',
  '53': '°C',
  '54': 's',
  '55': 's',
  '66': 'V',
  '67': 'V',
  '68': 'A',
  '69': '', // Status codes no unit
  '181': '',
  '182': '',
  '200': '',
  '239': '',
  '240': '',
  '241': '',
  '541': '',
  '759': '',
};

interface ValueWithUnit {
  value: number;
  unit: string;
}

export function transformIodata(
  iodata: IIodata,
): Record<string, number | ValueWithUnit> {
  const result: Record<string, number | ValueWithUnit> = {};

  for (const key in iodata) {
    const value = Number(iodata[key]);
    if (keyMap[key]) {
      const unit = unitMap[key] || '';
      result[keyMap[key]] = { value, unit };
    } else {
      // Unknown keys returned as plain number
      result[key] = value;
    }
  }

  return result;
}
