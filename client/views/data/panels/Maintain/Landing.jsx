import React from 'react';
import Pref from '/client/global/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';


const Landing = ({ equipData, maintainData, app, brancheS })=> {
  
  
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
      
      <div className='centreText'>
      <i className="fa-solid fa-robot fa-5x"></i>
      </div>
      
      <details className='footnotes'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          
        </p>
      </details>
      
      <div className='wide max875 vspacehalf'>
        

      </div>
            
    </div>
  );
};

export default Landing;