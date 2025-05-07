import React, { useState, useEffect, useRef } from "react";
import Pref from '/client/global/pref.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import { FilterSelect } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';
import ScatterCH from '/client/components/charts/ScatterCH';

const ProbScatter = ({ fetchFunc, fillfade, title, brancheS, app })=> {
  
  const mounted = useRef(true);
  
  const [ cvrtData, cvrtDataSet ] = useState(false);
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
      if(br.pro) {
        ops.push(br.branch);
      }
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
  
  useEffect( ()=> {
    const raw = !tickXY ? [] : showZero ? tickXY : tickXY.filter(t=>t.y[brFtr] > 0);
    const cnvrt = raw.map((d) => { return {
                x: d.x.toISOString(), y: showRate ? d.r[brFtr] : d.y[brFtr]
        }});
    cvrtDataSet(cnvrt);
  }, [tickXY, showRate, showZero, brFtr]);
  
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
      
      <ScatterCH
        strdata={cvrtData}
        title={title}
        fillColor={fillfade}
        intgr={!showRate}
      />

    </div>
  );
};

export default ProbScatter;