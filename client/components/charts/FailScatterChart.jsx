import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import { 
  VictoryZoomContainer,
  VictoryArea,
  VictoryScatter,
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip,
} from 'victory';
import Theme from '/client/global/themeV.js';
import PrintThis from '/client/components/tinyUi/PrintThis';


const FailScatterChart = ({ 
  fetchFunc, idLimit,
  print, height, leftpad, extraClass 
})=> {
  
  const mounted = useRef(true);
   
  const [ showZero, showZeroSet ] = useState(false);
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call(fetchFunc, idLimit, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(mounted.current) {
          tickXYSet(re);
        }
      }
    });
    
    return () => { mounted.current = false; };
  }, []);
  
  const dataset = !tickXY ? [] : showZero ? tickXY : tickXY.filter(t=>t.y > 0);

  return(
    <div className={'chartNoHeightContain ' + extraClass || ''}>
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
        {print && <PrintThis /> }
      </div>

      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 25, bottom: 25, left: leftpad || 30}}
        domainPadding={25}
        height={height || 200}
        containerComponent={<VictoryZoomContainer />}
      >
        <VictoryAxis
          tickFormat={(t) => !tickXY ? '*' : moment(t).format('MMM D YYYY')}
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
          maxBubbleSize={12}
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
      <p className='centreText small'>Test Failures</p>
      <p className='grayT small'>
        Y axis is number of items that failed<br />
        Datapoint size is scaled by how many failures<br /> 
        Scroll to Zoom. Click and Drag to Pan.<br />
      </p>
    </div>
  );
};

export default FailScatterChart;

