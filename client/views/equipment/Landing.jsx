import React from 'react';
import Pref from '/public/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';
import EqTimeReport from './EqTimeReport';

import Tabs from '/client/components/smallUi/Tabs/Tabs';

import CalWrap from './calendar/CalWrap';

const Landing = ({ equipData, maintainData, issues, app, brancheS })=> {
  
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
      
      <Tabs
        tabs={['Status', Pref.premaintain]}
        wide={false}
        stick={false}
        hold={true}
        sessionTab='equipExLandTabs'>
        
        <div className='autoGrid cardify twoDfill uspace vmarginhalf'>
          {brancheS.map( (br, ix)=> {
            const eqs = equipData.filter(e => e.branchKey === br.brKey);
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
      
        <CalWrap brancheS={brancheS} />
      
      </Tabs>

    </div>
  );
};

export default Landing;

const EqLandingCard = ({ br, eqs })=> {
  
  const onn = 'fa-solid fa-circle fa-fw greenT gapR';
  const off = 'fa-solid fa-circle-minus fa-fw yellowT gapR';
  const dis = 'fa-solid fa-circle-xmark fa-fw redT gapR';
  const nul = 'fa-regular fa-circle-xmark fa-fw wetasphaltT gapR';
  const flt = 'fa-solid fa-triangle-exclamation fa-fw orangeT gapR';
  const wrk = 'fa-regular fa-square-check fa-fw greenT gapR';
  
  return(
    <div className='max300'>
      <span>
        <h4 className='cap bottomLine'>{br.common}</h4>
      </span>
      <dl className='cap readlines'>
        {eqs.map( (eq, i)=>(
          <dd key={i} className='beside nomargin'>
            {eq.nullify ? <span title='Decommissioned'><i className={nul}></i></span> :
              eq.hibernate ? <span title='Disconnected'><i className={dis}></i></span> :
              eq.online ? <span title='Online'><i className={onn}></i></span> : 
              <span title='Offline'><i className={off}></i></span>
            }
            {eq.fault ? 
              <span title='WIP Issues'><i className={flt}></i></span> : 
              <span title='Good Working Order'><i className={wrk}></i></span>
            }
            <span>{eq.alias}</span>
          </dd>
        ))}
      </dl>
    </div>
  );
};