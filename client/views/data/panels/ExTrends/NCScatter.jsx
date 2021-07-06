import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';
import { 
  VictoryZoomContainer,
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';


const NCScatter = ({ app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllNCCount', (err, re)=>{
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
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
      </div>
      
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 5, right: 25, bottom: 25, left: 30}}
        domainPadding={25}
        height={250}
        containerComponent={<VictoryZoomContainer />}
      >
        <VictoryAxis
          tickFormat={(t) => moment(t).format('MMM D YYYY')}
          fixLabelOverlap={true}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '7px' }
          } }
          scale={{ x: "time" }}
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
          data={tickXY || []}
          style={{
            data: { 
              fill: ( datum ) => 
                datum.symbol == 'triangleUp' ? 'rgb(243, 156, 18)' : 'rgb(231, 76, 60)',
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
      
      <p className='lightgray fade'>
        ◼ = NonCons <br />
        ▲ = Shortfalls <br />
        Scroll to Zoom <br />
        Click and Drag to Pan <br />
        Reliable data begins {moment(app.createdAt).format('MMMM YYYY')}
      </p>
    </div>
  );
};

export default NCScatter;