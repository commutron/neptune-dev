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
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';


const ProbScatter = ({ fetchFunc, fill, fillfade, title, brancheS, app })=> {
  
  const mounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  const [ brOps, brOpsSet ] = useState([]);
  const [ brFtr, brFtrSet ] = useState(0);
  const [ showZero, showZeroSet ] = useState(false);
  const [ showRate, showRateSet ] = useState(false);
  
  useEffect( ()=> {
    let ops = ['wip'];
    for(let anc of app.ancillaryOption) {
      ops.push(anc);
    }
    for(let br of brancheS) {
      ops.push(br.branch);
    }
    brOpsSet(ops);
    
    Meteor.call(fetchFunc, ops, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(mounted.current) {
          tickXYSet(re);
        }
      }
    });
    
    return () => { mounted.current = false; };
  }, []);
  
  const dataset = !tickXY ? [] : showZero ? tickXY : tickXY.filter(t=>t.y[brFtr] > 0);
  
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
        
        <label className='beside gapR'>Zeros
          <input
            type='checkbox'
            className='minHeight'
            defaultChecked={showZero}
            onChange={()=>showZeroSet(!showZero)} 
        /></label>
        
        <FilterSelect
          unqID='fltrBRANCH'
          title={`Filter ${Pref.branch}`}
          selectList={brOps}
          selectState={brFtr}
          falsey='All'
          changeFunc={(e)=>brFtrSet(
                        e.target.value == false ? 0 :
                        brOps.findIndex(i=> i === e.target.value)+1
                      )}
        />
        <PrintThis />  
      </div>
      
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 25, bottom: 25, left: 30}}
        domainPadding={25}
        height={200}
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
          y={(d)=> !tickXY ? d.y : showRate ? d.r[brFtr] : d.y[brFtr]}
          interpolation='basis'
          style={{
            data: { 
              fill: fillfade
            },
          }}
        />
        
        <VictoryScatter
          data={dataset}
          y={(d)=> !tickXY ? d.y : showRate ? d.r[brFtr] : d.y[brFtr]}
          style={{
            data: { 
              fill: fill,
              strokeWidth: 0
            },
            labels: { 
              padding: 2,
            } 
          }}
          labels={(d)=> !tickXY ? d.z : d.z + d.y[brFtr]}
          labelComponent={
            <VictoryTooltip 
              style={{ fontSize: '6px' }}
            />}
        />
        
      </VictoryChart>
      
      <p className='centreText cap small'>{title}</p>
      <p className='grayT small'>
        Scroll to Zoom. Click and Drag to Pan.<br />
        Data curve is smoothed by a basis spline function<br />
      </p>
    </div>
  );
};

export default ProbScatter;