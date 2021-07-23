import React, { useState, useEffect, useRef } from "react";
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
import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';


const NCScatter = ({ app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  const [ showZero, showZeroSet ] = useState(false);
  const [ showSH, showSHSet ] = useState(false);
  const [ showRate, showRateSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllProbCount', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re);
        }
      }
    });
  }, []);
  
  const dataset = tickXY || [];
  const probset = showSH ? dataset.filter(d=> d.symbol !== 'square') :
                           dataset.filter(d=> d.symbol === 'square');
  const fullset = showZero ? probset : probset.filter(t=>t.y>0);
  
  return(
    <div className='chartNoHeightContain'>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        
        <ToggleSwitch 
          tggID='rateTick'
          toggleLeft='Total'
          toggleRight='Rate'
          toggleVal={showRate}
          toggleSet={showRateSet}
        />
        
        <ToggleSwitch 
          tggID='probTick'
          toggleLeft={Pref.nonCon}
          toggleRight={Pref.shortfall}
          toggleVal={showSH}
          toggleSet={showSHSet}
        />
        
        <label className='beside gapL'>Zeros
          <input
            type='checkbox'
            className='minHeight'
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
        
        <VictoryArea
          data={fullset}
          y={showRate ? 'r' : 'y'}
          interpolation='basis'
          style={{
            data: { 
              fill: 'rgba(211,84,0,0.2)'
            },
          }}
        />
        
        <VictoryScatter
          data={fullset}
          y={showRate ? 'r' : 'y'}
          style={{
            data: { 
              fill: ({ symbol }) => 
                symbol == 'square' ? 'rgb(231, 76, 60)' : 'rgb(230, 126, 34)',
              strokeWidth: 0
            },
            labels: { 
              padding: 2,
            } 
          }}
          size={1}
          labels={(d) => showRate ? d.s : d.z}
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
        Data begins {moment(app.createdAt).format('MMMM YYYY')}<br />
        Data curve is smoothed by a basis spline function
      </p>
    </div>
  );
};

export default NCScatter;