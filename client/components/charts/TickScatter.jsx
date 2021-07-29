import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis, 
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';


const TickScatter = ({ waterfall, rapidsData, app })=> {
  
  const [ tickXY, tickXYSet ] = useState([]);
  
  useEffect( ()=> {
    let allfalls = [];
    allfalls.push( waterfall );
    for(let cas of rapidsData) {
      allfalls.push( cas.cascade );
    }
    const flatfalls = allfalls.flat();
    
    let wipFallTicks = [];
    for( let fall of flatfalls ) {
      const tp = fall.type;
      let color = tp === 'inspect' ? 'rgb(39, 174, 96)' :
        		      tp === 'checkpoint' ? 'rgb(127, 140, 141)' :
        		      tp === 'test' ? 'rgb(22, 160, 133)' :
        		      tp === 'finish' ? 'rgb(142, 68, 173)' :
        		      'rgb(41, 128, 185)';
      fall.counts.map( (tick, index)=>{ 
        if(tick.tick > 0) {
          for(let t = tick.tick; t > 0; t--) {
            wipFallTicks.push({
              x: tick.time, 
              y: index+t,
              datum: color
            });
          }
        }
      });
    }
    tickXYSet(wipFallTicks);
  }, []);
  
  return(
    <div className='chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 20, right: 20, bottom: 20, left: 20}}
        domainPadding={25}
        height={200}
      >
        <VictoryAxis
          tickFormat={(t) => moment(t).format('MMM D')}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '7px' }
          } }
          scale={{ x: "time" }}
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
          size={4}
        />
      </VictoryChart>
    </div>
  );
};

export default TickScatter;