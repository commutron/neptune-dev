import React from 'react';
import Pref from '/client/global/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';
import EqTimeReport from './EqTimeReport';

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
      
      <CalWrap brancheS={brancheS} />

    </div>
  );
};

export default Landing;