import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';
import { 
  VictoryLine,
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';


const PerfScatter = ({ app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState([]);
  
  useEffect( ()=> {
    Meteor.call('getAllPerform', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re);
        }
      }
    });
  }, []);
  
  return(
    <div className='chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 25, right: 25, bottom: 10, left: 25}}
        domainPadding={25}
        height={250}
      >
        <VictoryAxis
          tickFormat={(t) => moment(t).format('MMM D')}
          // fixLabelOverlap={true}
          offsetY={15}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: 'transparent' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '7px' }
          } }
          scale={{ x: "time" }}
          // crossAxis={true}
        />
        <VictoryAxis
          style={ {
            axis: { stroke: 'rgb(46, 204, 113)', strokeWidth: '2px' },
            ticks: { stroke: 'transparent' },
          } }
          tickFormat={() => ''}
          // crossAxis={true}
        />
        <VictoryAxis 
          dependentAxis
          fixLabelOverlap={true}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '7px' }
          } }
        />
          
        <VictoryScatter
          data={tickXY}
          style={{
            data: { 
              fill: ({ datum }) => datum,
              strokeWidth: 0
            },
            labels: { 
              padding: 2,
            } 
          }}
          size={2}
        />
        {/*
        <VictoryLine
          data={[{x:0,y:0}]}
          style={{
            data: { 
              strokeWidth: 3
            },
          }}
          size={2}
        />*/}
      </VictoryChart>
    </div>
  );
};

export default PerfScatter;