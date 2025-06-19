import React from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';

const MiniHistory = ({ history, iAlt, altitle })=> {
  
  const extended = iAlt ? iAlt.filter( x => x.rapId !== false ) : [];

  const lineColor = {
    build: 'borderBlue',
    first: 'borderBlue',
    inspect: 'borderGreen',
    test: 'borderTeal',
    nest: 'borderTeal',
    checkpoint: 'borderPurple',
    finish: 'borderPurple'
  };
  
  return(
    <div>
      
      {altitle && 
        <div className='altBanner cap'>Alt Flow: {altitle}</div> }
            
      {extended.map( (e, ix)=>(
        <div key={ix} className='rapDidBanner'
          >Extended <n-num>{moment(e.assignedAt).calendar()}</n-num>
        </div>
      ))}
        
      {history.length > 0 ?
        <div className='miniHistory vgap'>
          {history.map( (hst, idx)=>{
            const brdr = !hst.good ? 'borderRed' : lineColor[hst.type] || 'borderGray';
        		return( 
        		  <p className={`bottomLine cap indent10 margin5 ${brdr}`} key={idx}>
        		    <i>{
        		      !hst.good && <n-fa0><i className='fas fa-times fa-fw redT gapR'></i></n-fa0>
        		    }{hst.step} - {hst.type}
        		    </i><br /><n-sm>{moment(hst.time).calendar()}</n-sm>
        		  </p>
          )})}
        </div>
        : <h4 className='centreText'>{Pref.Item} Unstarted</h4> }
    </div>
  );
};
  
export default MiniHistory;