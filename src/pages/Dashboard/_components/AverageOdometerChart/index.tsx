import {
  Chart as ChartJS,
  ChartData,
  ArcElement,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  BarControllerChartOptions,
} from 'chart.js';
import { _DeepPartialObject } from 'node_modules/chart.js/dist/types/utils';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement);

type Props = {
  data: ChartData<'doughnut', number[], string>;
  options?: _DeepPartialObject<
    | (CoreChartOptions<'doughnut'> &
        ElementChartOptions<'doughnut'> &
        PluginChartOptions<'doughnut'> &
        DatasetChartOptions<'doughnut'> &
        ScaleChartOptions<'doughnut'> &
        BarControllerChartOptions)
    | undefined
  >;
};

ChartJS.defaults.font.family = 'Plus Jakarta Sans';
ChartJS.defaults.color = '#fff';
ChartJS.defaults.font.size = 11;

const AverageOdometerChart = ({ data, options }: Props) => {
  return (
    <Doughnut
      id="average-odometer-chart"
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

export default AverageOdometerChart;
