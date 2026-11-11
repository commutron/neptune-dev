import React, { useState } from 'react';
import Pref from '/public/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';
import EqTimeReport from './EqTimeReport';

import { FilterSelect } from '/client/components/smallUi/ToolBarTools';
import Tabs from '/client/components/smallUi/Tabs/Tabs';

import CalWrap from './calendar/CalWrap';

const Landing = ({ equipData, maintainData, issues, app, brancheS })=> {
  
  const [ brKey, brKeySet ] = useState(null);
  const handleEqBr = (val)=> {
  	brKeySet(val === 'false' ? null : val === '0undefined' ? false : val);
  };
  
  return(
    <div>
      <div className='wide rowWrap'>
        <span className='rowWrap gapminC'>
          <NumBox
            num={equipData.filter( e => e.online && !e.hibernate ).length}
            name='Online'
            color='greenT' 
          />
          <NumBox
            num={equipData.filter( e => !e.online && !e.hibernate ).length}
            name='Offline'
            color='midnightBlueT' 
          />
          <NumBox
            num={equipData.filter( e => e.hibernate ).length}
            name={Pref.eqhib}
            color='darkgrayT' 
          />
          <NumBox
            num={issues || 0}
            name={`WIP ${Pref.eqissue}`}
            color='orangeT' 
          />
        </span>
        
        <span className='flexSpace' />
        
        <span className='rowWrap gapsC'>
          <EqTimeReport />
          
          <EquipForm
            id={false}
            lgIcon={true}
            rootURL={app.instruct}
            brancheS={brancheS} 
          />
        </span>
      </div>
      
      <div className='slotGrid gapminR'>
		  	<FilterSelect
	        unqID='fltrEQbranch'
	        title={`Filter by ${Pref.branch}`}
	        selectList={[['0undefined','Unassigned'],...brancheS.map( (br)=>[br.brKey, br.branch])]}
	        selectState={brKey}
	        falsey={`All ${Pref.branches}`}
	        changeFunc={(v)=>handleEqBr(v.target.value)}
	        icon='fas fa-code-branch'
	        extraClass='minWfit'
	        wrapClass='rightSlot'
	      />
      
        <Tabs
          tabs={[
            <span><i className='fa-solid fa-power-off fa-fw gapR'></i>Status</span>,
            <span><i className='fa-regular fa-calendar-days fa-fw gapR'></i>Calendar</span>
          ]}
          wide={false}
          stick={false}
          hold={true}
          sessionTab='equipExLandTabs'
          tabcss='leftSlot'
          bodycss='autoSlot'>
        
          <div className='autoGrid cardify twoDfill uspace vmarginhalf'>
            {[...brancheS,{brKey: false,common: 'Facility'}].map( (br, ix)=> {
              const eqs = equipData.filter(e => e.branchKey === br.brKey && !e.nullify);
              if(eqs.length > 0) {
                return(
                  <EqLandingCard
                    key={ix}
                    br={br}
                    eqs={eqs}
                  />
                );
              }else{null}
            })}
          </div>
        
          <CalWrap brKey={brKey} />
        
        </Tabs>
      
      </div>

    </div>
  );
};

export default Landing;

const EqLandingCard = ({ br, eqs })=> {
  
  const onn = 'fa-solid fa-circle fa-fw greenT gapR';
  const off = 'fa-solid fa-circle-minus fa-fw yellowT gapR';
  const dis = 'fa-solid fa-circle-xmark fa-fw redT gapR';
  const flt = 'fa-solid fa-triangle-exclamation fa-fw orangeT gapR';
  const wrk = 'fa-regular fa-square-check fa-fw wetasphaltT gapR';
  
  return(
    <div className='max400'>
      <span>
        <h4 className='cap bottomLine'>
          {br.common}
          </h4>
      </span>
      <dl className='cap flexSpace colNoWrap gapminR'>
        {eqs.map( (eq, i)=>(
          <dd key={i} className='beside nomargin'>
            { eq.hibernate ? <span title='Disconnected'><i className={dis}></i></span> :
              eq.online ? <span title='Online'><i className={onn}></i></span> : 
              <span title='Offline'><i className={off}></i></span>
            }
            <button 
              className='line15x cap med leftText textAction flexSpace' 
              onClick={()=>FlowRouter.go("/equipment/" + eq.alias)}
            >{eq.alias}</button>
            {eq.fault ? 
              <span title='WIP Issues'><i className={flt}></i></span> : 
              <span title='Good Working Order'><i className={wrk}></i></span>
            }
          </dd>
        ))}
      </dl>
    </div>
  );
};