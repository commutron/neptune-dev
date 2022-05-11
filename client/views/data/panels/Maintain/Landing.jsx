import React from 'react';
import Pref from '/client/global/pref.js';

import EquipForm from '/client/components/forms/Equip/EquipForm';
import NumBox from '/client/components/tinyUi/NumBox';


const Landing = ({ groupData, widgetData, variantData, app })=> {
  
  
  return(
    <div className='overscroll'>
      
      <div className='wide comfort'>
        <div className='centreRow'>
          
        </div>
        <div className='centreRow'>
          <EquipForm
            name={false}
            lgIcon={true}
            rootURL={app.instruct} />
          <NumBox
            num={groupData.length}
            name={Pref.group + 's'}
            color='blueT' />
          <NumBox
            num={widgetData.length}
            name={Pref.widget + 's'}
            color='blueT' />
          <NumBox
            num={variantData.length}
            name={Pref.variants}
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