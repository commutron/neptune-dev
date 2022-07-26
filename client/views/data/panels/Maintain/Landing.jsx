import React from 'react';
import moment from 'moment';
import 'moment-business-time';
import Pref from '/client/global/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';

const Landing = ({ equipData, maintainData, app, brancheS })=> {
  
  const runRobot = ()=> {
    Meteor.call('pmRobot', (err)=>{
      err && console.log(err);
    });
  };
  
  return(
    <div className='overscroll'>
      
      <div className='wide comfort'>
        <div className='centreRow'>
          
        </div>
        <div className='centreRow'>
          <EquipForm
            id={false}
            lgIcon={true}
            rootURL={app.instruct}
            brancheS={brancheS} />
          <NumBox
            num={equipData.length}
            name={Pref.equip}
            color='blueT' />
        </div>
      </div>
      
      <details className='footnotes'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          
        </p>
      </details>
      
      <div className='wide max875 vspacehalf'>
        
        <button onClick={()=>runRobot()} className='action nSolid beside'
        ><i className="fa-solid fa-robot fa-lg gap"></i>Run Service Robot</button>
        
      </div>
      
    </div>
  );
};

export default Landing;