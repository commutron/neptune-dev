import React from 'react';
import Pref from '/client/global/pref.js';

const EquipCard = ({ equipData, maintainData })=> {
  
  const sorts = maintainData.map( (m)=> {
    const equip = equipData.find( eq => eq._id === m.equipId );
    return({
      title: (equip?.alias || '') + '-' + m.name,
      find: 'Eq-' + (equip?.alias || '') +' ~ '+ m.name,
      mId: m._id
    });
  }, [])
  .sort( (e1, e2)=> e1.title > e2.title ? 1 : e1.title < e2.title ? -1 : 0);
  
  return(
    <div className='centre pop vmargin space min200 max600 midnightGlow'>
      <p className='med wide bottomLine cap'>{Pref.equip} {Pref.premaintain}</p>
      <div className='rowWrap vmarginhalf'>
      {sorts.map( (m, ix)=> (
        <button 
          key={ix}
          className='action whiteSolid margin5 letterSpaced spacehalf'
          onClick={()=>{Session.set('now', m.find);Session.set('nowSV', m.mId)}}
        >{m.title}</button>
    ))}
    </div>
   </div>
  );
};

export default EquipCard;