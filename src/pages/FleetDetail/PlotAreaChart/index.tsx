import { PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartData,
  ArcElement,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  Legend,
  Tooltip,
  Title,
  PolarAreaControllerChartOptions,
  RadialLinearScale,
} from 'chart.js';
import { _DeepPartialObject } from 'node_modules/chart.js/dist/types/utils';

ChartJS.register(ArcElement, Title, Tooltip, Legend, RadialLinearScale);

type Props = {
  data: ChartData<'polarArea', number[], string>;
  options?: _DeepPartialObject<
    CoreChartOptions<'polarArea'> &
      ElementChartOptions<'polarArea'> &
      PluginChartOptions<'polarArea'> &
      DatasetChartOptions<'polarArea'> &
      ScaleChartOptions<'polarArea'> &
      PolarAreaControllerChartOptions
  >;
};

ChartJS.defaults.font.family = 'Inter';
ChartJS.defaults.color = 'black';
ChartJS.defaults.font.size = 11;

const PlotAreaChart = ({ data, options }: Props) => {
  return (
    <PolarArea
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        color: 'black',
        font: {
          family: 'Inter',
          size: 9,
        },
        ...options,
      }}
    />
  );
};

export default PlotAreaChart;
