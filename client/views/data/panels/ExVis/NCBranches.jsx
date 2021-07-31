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
import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';


const NCBranches = ({ brancheS, app })=> {
  
  const thingMounted = useRef(true);
  
  const [ brOps, brOpsSet ] = useState([]);
  const [ brFtr, brFtrSet ] = useState(0);
  const [ showZero, showZeroSet ] = useState(false);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    let ops = ['before release'];
    for(let anc of app.ancillaryOption) {
      ops.push(anc);
    }
    for(let br of brancheS) {
      ops.push(br.branch);
    }
    for(let oth of ['after complete', 'out of route', 'wip', 'unknown']) {
      ops.push(oth);
    }
    brOpsSet(ops);
      
    Meteor.call('getAllBrNcCount', ops, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re);
        }
      }
    });
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
        <FilterSelect
          unqID='fltrBRANCH'
          title={`Filter ${Pref.branch}`}
          selectList={brOps}
          selectState={brFtr}
          falsey={false}
          changeFunc={(e)=>brFtrSet(brOps.findIndex(i=> i === e.target.value))}
        />
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
          y={(d)=> !tickXY ? d.y : d.y[brFtr]}
          interpolation='basis'
          style={{
            data: { 
              fill: 'rgba(211,84,0,0.2)'
            },
          }}
        />
        <VictoryScatter
          data={dataset}
          y={(d)=> !tickXY ? d.y : d.y[brFtr]}
          style={{
            data: { 
              fill: 'rgb(231, 76, 60)',
              strokeWidth: 0
            },
            labels: { 
              padding: 2,
            } 
          }}
          labels={(d)=> tickXY ? d.z + d.y[brFtr] : d.z}
          labelComponent={
            <VictoryTooltip 
              style={{ fontSize: '6px' }}
            />}
        />

      </VictoryChart>
      <p className='centreText'>Noncons by Branch</p>
      <p className='lightgray fade'>
        Scroll to Zoom <br />
        Click and Drag to Pan <br />
        Data begins {moment(app.createdAt).format('MMMM YYYY')}<br />
      </p>
    </div>
  );
};

export default NCBranches;

