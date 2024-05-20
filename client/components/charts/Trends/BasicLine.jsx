import React from 'react';
// import Pref from '/client/global/pref.js';
// import moment from 'moment';
// import 'moment-timezone';


// import { 
//   VictoryLine, 
//   VictoryChart, 
//   VictoryAxis,
// } from 'victory';
// import '/client/global/themeC';


// import Chart from 'chart.js/auto'
import {
  LineController,
  LineElement,
  PointElement,
  CategoryScale, LinearScale,
  // Tooltip
} from 'chart.js';
import { ReactChart } from 'chartjs-react';

// Register modules,
ReactChart.register(
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale, 
  // TimeScale, 
  // Tooltip
);

const BasicLine = ({ data, cycleCount, lineColor, title })=> {
  
  const chartData = {
    datasets: [{
      data: [20, 10],
    }],
    labels: ['a', 'b']
  };
  
  chartOption = {
    datasets: { line: { backgroundColor: 'blue', borderColor: 'var(--emerald)' } }
  };
  
  return(
    <div className='chart20Contain'>
      
      <ReactChart
        type="line"
        data={chartData}
        options={chartOption}
        height={400}
      />
      
     </div>
  );
};

export default BasicLine;
/*

    <VictoryChart
      padding={{top: 25, right: 25, bottom: 25, left: 25}}
      domainPadding={{x: 10, y: 40}}
      height={400}
    >
      <VictoryAxis
        tickCount={data.length}
        tickFormat={(t) => isNaN(cycleCount-t) ? '*' : `-${cycleCount-t}`}
      />
      <VictoryLine
        data={data}
        style={{ data: { stroke: lineColor || 'black' } }}
        animate={{
          duration: 2000,
          onLoad: { duration: 500 }
        }}
  */