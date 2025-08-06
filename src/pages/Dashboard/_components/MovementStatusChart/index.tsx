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
  Legend,
  Tooltip,
  Title,
} from 'chart.js';
import { _DeepPartialObject } from 'node_modules/chart.js/dist/types/utils';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

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

ChartJS.defaults.font.family = 'Inter';
ChartJS.defaults.color = '#fff';
ChartJS.defaults.font.size = 11;

const MovementStatusChart = ({ data, options }: Props) => {
  return (
    <Doughnut
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

export default MovementStatusChart;
