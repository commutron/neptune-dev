import React from 'react';
import Pref from '/client/global/pref.js';

const EquipCard = ({ equipData, maintainData })=> {
  
  const sorts = maintainData.map( (m)=> {
    const equip = equipData.find( eq => eq._id === m.equipId );
    return({
      title: (equip?.alias || '') + '-' + m.name,
      find: 'Eq-' + (equip?.alias || '') +' ~ '+ m.name,
      mId: m._id,
      flg: m.status
    });
  }, [])
  .sort( (e1, e2)=> e1.title > e2.title ? 1 : e1.title < e2.title ? -1 : 0);
  
  const openFixTime = ()=> {
    document.getElementById('equipfixdialog')?.showModal();
  };
  
  const gotoMaint = (find, mId)=> {
    Session.set('now', find);
    Session.set('nowSV', mId);
  };
  
  return(
    <div className='centre pop vmargin space min200 max600 darkCard midnightGlow'>
      <p className='med wide bottomLine cap'>{Pref.equip} {Pref.premaintain}</p>
      <div className='centre' style={{justifyContent: 'space-between', flex: 'auto'}}>
      	<div className='rowWrap vmarginhalf'>   
          {sorts.map( (m, ix)=> (
            <button 
              key={ix}
              className='action whiteSolid margin5 leftText letterSpaced spacehalf'
              onClick={()=>gotoMaint(m.find, m.mId)}
            >{m.flg === 'willnotrequire' ?
              <n-fa3><i className='fa-solid fa-clipboard fa-fw orangeT gapR'></i></n-fa3>
            : m.flg === 'notrequired' ?
              <n-fa2><i className='fa-solid fa-ban fa-fw orangeT gapR'></i></n-fa2>
            : m.flg === 'complete' ?
              <n-fa1><i className='fa-solid fa-clipboard-check fa-fw greenT gapR'></i></n-fa1>
            : <n-fa0><i className='fa-regular fa-clipboard fa-fw grayT gapR'></i></n-fa0>
            }{m.title}</button>
          ))}
        </div>
        <button
    	      title='Equipment Repair'
    	      className='tideFix spacehalf blackblack'
    	      onClick={()=>openFixTime()}
    	      disabled={false}
    	    >
    	    <b>
    	      <span className='fa-stack tideIcon'>
    	        <i className="fas fa-circle-notch fa-stack-2x tideIndicate"></i>
    	        <i className="fa-solid fa-screwdriver-wrench fa-stack-1x" data-fa-transform="shrink-1"></i>
    	      </span>
    	    </b>
    	    <b>{Pref.equip} Repair</b>
    	   </button>
      </div>
   </div>
  );
};

export default EquipCard;