import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';
import { 
  VictoryZoomContainer,
  VictoryArea,
  VictoryScatter,
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip,
} from 'victory';
// import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import PrintThis from '/client/components/tinyUi/PrintThis';


const FailScatter = ({ app })=> {
  
  const thingMounted = useRef(true);
  
  const [ showZero, showZeroSet ] = useState(false);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllFailCount', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re);
        }
      }
    });
  }, []);
  
  const dataset = !tickXY ? [] : showZero ? tickXY : tickXY.filter(t=>t.y > 0);

  return(
    <div className='chartNoHeightContain'>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        <label className='beside gapL'>Zeros
          <input
            type='checkbox'
            className='minHeight gapL'
            defaultChecked={showZero}
            onChange={()=>showZeroSet(!showZero)} 
        /></label>
        <PrintThis />  
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
              fontSize: '6px' }
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
              fontSize: '6px' }
          } }
        />
        <VictoryArea
          data={dataset}
          interpolation='basis'
          style={{
            data: { 
              fill: 'rgba(192, 57, 43,0.2)'
            },
          }}
        />
        <VictoryScatter
          data={dataset}
          bubbleProperty="q"
          minBubbleSize={2}  
          maxBubbleSize={16}
          style={{
            data: { 
              fill: 'rgb(192, 57, 43)',
              strokeWidth: 0
            },
            labels: { 
              padding: 2,
            } 
          }}
          labels={(d)=> d.z}
          labelComponent={
            <VictoryTooltip 
              style={{ fontSize: '6px' }}
            />}
        />

      </VictoryChart>
      <p className='centreText'>Test Failures</p>
      <p className='lightgray fade'>
        Y axis is number of items that failed<br />
        Datapoint size is scaled by how many failures<br /> 
        Scroll to Zoom <br />
        Click and Drag to Pan <br />
        Data begins {moment(app.createdAt).format('MMMM YYYY')}<br />
      </p>
    </div>
  );
};

export default FailScatter;

