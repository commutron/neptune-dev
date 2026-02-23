import React, { useMemo, useState } from 'react';
import Pref from '/public/pref.js';
// import TagsModule from '/client/components/bigUi/TagsModule';
// import { PopoverButton, PopoverMenu, PopoverAction } from '/client/layouts/Models/Popover';

// import DumbFilter from '/client/components/tinyUi/DumbFilter';

const BranchSlide = ({ 
  brData, app, 
  canRun, canEdt, canCrt, canRmv 
})=>{
  
  // const [ filterString, filterStringSet ] = useState( '' );
  
  return(
    <div className='section overscroll' key={brData.brKey}>
      
          
      <h1 className='cap bigger centreText bottomLine'>{brData.branch}</h1>

      <div className='floattaskbar light'>
        
        
        <span className='flexSpace' />
        
        <div>
          
        </div>
      </div>
        
      <div className='wide comfort'>
      
        {brData.open &&
          <Banner 
            title={'Open ' + Pref.group}
            icon='fa-home'
            colour='nT'
            bcolour='intrBlueSq'
          />
        }
          
        {brData.pro &&
          <Banner 
            title={'Pro ' + Pref.branch}
            sub=''
            icon='fa-home'
            colour='nT'
            bcolour='intrBlueSq'
          />
        }
        
      </div>
      
      {brData.pro &&
        <p className='w100 indenText'>
        <span className='mockTag'>
          <i className="fa-solid fa-paper-plane fa-lg gapR"></i>Pro
        </span>
        </p>
      }
      
     
      
    
    </div>
  );
};

export default BranchSlide;

const Banner = ({ title, sub, icon, colour, bcolour })=> (
  <div className={'centreText comfort beside w100 vmargin cap ' + bcolour}>
    <i className={`fa-solid ${icon} fa-fw fa-2x gapL ${colour}`}></i>
    <span>
      <h3>{title}</h3>
      <p>{sub || ''}</p>
    </span>
    <i className={`fa-solid ${icon} fa-fw fa-2x gapR ${colour}`}></i>
  </div>
);