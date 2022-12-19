import React from 'react';
import Pref from '/client/global/pref.js';

import ModelNative from '/client/layouts/Models/ModelNative';

const EquipMenu = ({ user, brancheS, allEquip })=> (
	<ModelNative
    dialogId='equipfixdialog'
    title={`${Pref.equip} ${Pref.fixmaintain}`}
    icon='fa-solid fa-screwdriver-wrench'
    colorT='midnightblueT'
    dark={true}
    >
      <EquipMenuCore
        user={user}
        brancheS={brancheS}
        allEquip={allEquip}
      />
  </ModelNative>
);

export default EquipMenu;

const EquipMenuCore = ({ user, brancheS, allEquip })=> {
  
  const eng = user?.engaged;
  const eqfxON = eng?.task === 'EQFX';
  
  const goclose = (alias, id)=> {
    Session.set('now', 'EqFx-' + alias +' ~ repair');
    Session.set('nowSV', id);
  	const dialog = document.getElementById('equipfixdialog');
    dialog?.close();
  };
  
  return(
    <div className='min600 max750 vmargin'>
      {[{brKey: false, branch: 'Facility'},...brancheS].map( (br)=> {
        const brEq = allEquip.filter( e => e.branchKey === br.brKey );
        if(brEq.length > 0) {
          return(
            <div key={br.brKey} className='vmarginhalf spacehalf'>
              <p className='wide vmarginhalf bottomLine cap'>{br.branch}</p>
              {brEq.map( (eq)=>(
                <button 
                  key={eq._id}
                  className='action whiteSolid margin5 letterSpaced spacehalf'
                  onClick={()=>goclose(eq.alias, eq._id)}
                >{eqfxON && eng.tName.split("<*>")[1] === eq._id ?
                <n-fa1><i className='fa-solid fa-circle-notch midnightblueT fa-fw gapR fa-spin'></i></n-fa1>
                : null}{eq.alias}</button>
              ))}
            </div>
          );
        }else{null}
      })}
    </div>
  );
};