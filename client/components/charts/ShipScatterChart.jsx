import React from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';
import { 
  VictoryZoomContainer,
  VictoryScatter,
  VictoryArea,
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip
} from 'victory';
import Theme from '/client/global/themeV.js';


const ShipScatterChart = ({ xy, height, leftpad })=> {
  
  return(
    <VictoryChart
      theme={Theme.NeptuneVictory}
      padding={{top: 5, right: 25, bottom: 10, left: leftpad || 25}}
      domainPadding={25}
      height={height || 250}
      containerComponent={
        <VictoryZoomContainer
          zoomDimension="x"
          minimumZoom={{x: 1000/500, y: 0.1}}
        />}
    >
      <VictoryAxis
        tickFormat={(t) => moment(t).format('MMM D YYYY')}
        fixLabelOverlap={true}
        offsetY={15}
        style={ {
          axis: { stroke: 'grey' },
          grid: { stroke: 'transparent' },
          ticks: { stroke: '#5c5c5c' },
          tickLabels: { 
            fontSize: '6px' }
        } }
        scale={{ x: "time" }}
        orientation="bottom"
      />
      <VictoryAxis
        style={ {
          axis: { stroke: '#000', strokeWidth: '3px' },
          ticks: { stroke: 'transparent' },
        } }
        tickFormat={() => ''}
      />
      <VictoryAxis 
        dependentAxis
        fixLabelOverlap={true}
        style={ {
          axis: { stroke: 'grey' },
          grid: { stroke: '#5c5c5c' },
          ticks: { stroke: '#5c5c5c' },
          tickLabels: { 
            fontSize: '6px' }
        } }
      />
      <VictoryArea
        data={xy || []}
        interpolation='basis'
        style={{
          data: { 
            fill: 'rgba(46, 204, 113,0.2)'
          },
        }}
      />
      <VictoryScatter
        data={xy || []}
        style={{
          data: { 
            fill: 'rgb(39, 174, 96)',
            strokeWidth: 0
          },
          labels: { 
            padding: 2,
          } 
        }}
        size={1}
        labels={(d) => d.z}
        labelComponent={
          <VictoryTooltip 
            style={{ fontSize: '6px' }}
          />}
      />
    </VictoryChart>
  );
};

export default ShipScatterChart;