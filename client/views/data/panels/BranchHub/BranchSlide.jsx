import React, { useLayoutEffect, useState } from 'react';
import Pref from '/public/pref.js';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

import { flexSort } from '/client/utility/Arrays.js';
import BranchReport from './BranchReport';

const BranchSlide = ({ 
  brData, equipData, app, 
  // canRun, canEdt, canCrt, canRmv 
})=>{
  
  const [ reportCol, reportColSet ] = useState(1);
  
  const [ eqs, eqsSet ] = useState([]);
  const [ qs, qsSet ] = useState([]);
  const [ subs, subsSet ] = useState([]);
  const [ steps, stepsSet ] = useState([]);
  
  useLayoutEffect( ()=> {
    const equipS = flexSort(equipData, 'alias');
    eqsSet(equipS);
    
    const qtasks = app.qtTasks.filter( q => q.brKey === brData.brKey);
    const qtaskS = flexSort(qtasks, 'position', true);
    const qkeys = qtaskS.map( qt => qt.qtKey, []);
    qsSet(qkeys);
    
    const subtasks = qtaskS.map( qs => qs.subTasks, []).flat();
    subsSet(subtasks);
    
    const trackops = app.trackOption.filter( t => t.branchKey === brData.brKey);
    const tsteps = flexSort([...new Set(trackops.map( to => to.step, []))]);
    stepsSet(tsteps);
    
  },[]);
    
  return(
    <div className='section overscroll' key={brData.brKey}>
          
      <h1 className='cap bigger centreText bottomLine'>{brData.branch}</h1>
      
      <div className='wide comfort'>
       {brData.pro &&
          <p className='w100'>
          <span className='mockTag nBg'>
            <i className="fa-solid fa-paper-plane fa-lg gapR"></i>Pro
          </span>
          </p>
        }
      </div>
      
      <Taglist 
        title={Pref.equip}
        list={eqs}
        status='online'
        name='alias'
        bcolor=''
        oncolor="midnightblue"
        offcolor="darkgray" 
      />
      
      <Taglist 
        title="Sub-Tasks"
        list={subs}
        oncolor=""
        bcolor='borderGreen'
      />
      
      <Taglist 
        title={Pref.flow + ' steps'}
        list={steps}
        oncolor="blue"
        bcolor='borderBlue'
      />
      
      <div className='balancer scrollWrap thinScroll'
        style={{flexFlow: 'row nowrap',gridGap: '12px'}}
      >
      {Array(reportCol).fill(null).map( (v,i)=>(
        <BranchReport
          key={i}
          reportCol={reportCol}
          colIndex={i}
          branch={brData.branch}
          qs={qs}
          subs={subs}
          steps={steps}
          
          rmvCol={()=>reportColSet(reportCol-1)}
        />
      ))}
      <div style={{border: '1px dotted var(--silverfade)'}}
        className='spacehalf centre overscroll'
        >
        <label 
          htmlFor='addBrRprt' 
          className='vmargin min200 centre'
        >
          <button
            id='addBrRprt'
            className='centre'
            onClick={()=>reportColSet(reportCol+1)}
          >
            <span className='medSm darkgrayT'>Add Report</span>
            <span className='roundAction beside margin5 cloudsT'>
              <i className='fas fa-plus'></i>
            </span>
          </button>
          <button
            id='rmvBrRprt'
            className='centre vmarginquarter'
            onClick={()=>reportColSet(reportCol-1)}
            disabled={reportCol < 2}
          >
            <span className='medSm darkgrayT'>Remove Last</span>
            <span className='roundAction beside margin5 cloudsT'>
              <i className='fas fa-times'></i>
            </span>
          </button>
        </label>
      </div>
      </div>
      
    </div>
  );
};

export default BranchSlide;

const Taglist = ({ title, list, status, name, bcolor, oncolor, offcolor })=> (
  <details className='vmarginhalf'>
    <summary className={`cap smTxt spaceLine borderLeft ${bcolor}`}>{title}</summary>
    <p className='rowWrap'>
      {list.map( (e, i)=> (
        <span key={i} className={`mockTag gapR cap ${status && !e[status] ? offcolor : oncolor}`}>
          {name ? e[name] : e}
        </span>
      ))}
    </p>
  </details>
);