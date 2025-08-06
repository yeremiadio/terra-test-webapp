import {
  FaTachometerAlt, // Speed, vehicleSpeed, engineRpm
  FaSignal, // gsmSignal
  FaThermometerHalf, // coolantTemperature, intakeAirTemperature, ambientAirTemperature
  FaBolt, // ignition, externalVoltage, controlModuleVoltage
  FaGasPump, // fuelType
  FaWrench, // numberOfDtc
  FaCar, // movement
  FaClock, // runtimeSinceEngineStart, timeRunWithMilOn, timeSinceCodesCleared
  FaRoad, // totalOdometer, distanceTraveledMilOn, distanceSinceCodesClear
  FaCompress, // engineLoad, throttlePosition
  FaSlidersH, // commandedEquivalenceR
  FaMobileAlt,
  FaCarBattery, // activeGsmOperator
} from 'react-icons/fa';
import { HiSignal } from 'react-icons/hi2';
import { GiBattery100, GiNightSleep } from 'react-icons/gi';
import { IconBase } from 'react-icons/lib';

export function getIconIoData(key: string) {
  switch (key) {
    case '16': // totalOdometer
    case '43': // distanceTraveledMilOn
    case '49': // distanceSinceCodesClear
      return FaRoad;
    case '21': // gsmSignal
      return FaSignal;
    case '24': // speed
    case '37': // vehicleSpeed
    case '36': // engineRpm
      return FaTachometerAlt;
    case '30': // numberOfDtc
      return FaWrench;
    case '31': // engineLoad
    case '41': // throttlePosition
      return FaCompress;
    case '32': // coolantTemperature
    case '39': // intakeAirTemperature
    case '53': // ambientAirTemperature
      return FaThermometerHalf;
    case '42': // runtimeSinceEngineStart
    case '54': // timeRunWithMilOn
    case '55': // timeSinceCodesCleared
      return FaClock;
    case '51': // controlModuleVoltage
    case '66': // externalVoltage
      return FaCarBattery;
    case '67': // batteryVoltage
      return FaBolt;
    case '68': // batteryCurrent
      return GiBattery100;
    case '239': // ignition
      return FaBolt;
    case '69': // gnssStatus
    case '181': // gnssPdop
    case '182': // gnssHdop
      return HiSignal;
    case '200': // sleepMode
      return GiNightSleep;
    case '240': // movement
      return FaCar;
    case '241': // activeGsmOperator
      return FaMobileAlt;
    case '541': // commandedEquivalenceR
      return FaSlidersH;
    case '759': // fuelType
      return FaGasPump;
    default:
      return IconBase; // or some default icon component
  }
}
