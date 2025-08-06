import {
  Chart as ChartJS,
  ChartData,
  CoreChartOptions,
  ElementChartOptions,
  PluginChartOptions,
  DatasetChartOptions,
  ScaleChartOptions,
  Legend,
  Tooltip,
  Title,
  LineControllerChartOptions,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  Filler,
} from 'chart.js';
import { _DeepPartialObject } from 'node_modules/chart.js/dist/types/utils';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
);

type Props = {
  data: ChartData<'line', any[], string>;
  options?: _DeepPartialObject<
    | (CoreChartOptions<'line'> &
        ElementChartOptions<'line'> &
        PluginChartOptions<'line'> &
        DatasetChartOptions<'line'> &
        ScaleChartOptions<'line'> &
        LineControllerChartOptions)
    | undefined
  >;
};

ChartJS.defaults.font.family = 'Inter';
ChartJS.defaults.color = 'black';
ChartJS.defaults.font.size = 11;

const IoDataTrendChart = ({ data, options }: Props) => {
  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'right',
          },
          title: {
            display: false,
          },
        },
        layout: {
          padding: {
            top: 10,
            right: 10,
            bottom: 5,
            left: 5,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute',
              displayFormats: {
                minute: 'YY/D/M HH:mm',
              },
            },
            grid: {
              display: false,
            },
            ticks: {
              stepSize: 100,
            },
          },
          y: {
            offset: true,
            grid: {
              display: false,
            },
            beginAtZero: true,
            ticks: {
              callback: (value: any) => {
                return `${value.toLocaleString('id')}`;
              },
              display: true,
              precision: 0,
              maxTicksLimit: 10,
            },
          },
        },
        ...options,
      }}
    />
  );
};

export default IoDataTrendChart;
