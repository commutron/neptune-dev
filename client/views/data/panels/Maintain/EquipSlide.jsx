import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
// import TagsModule from '/client/components/bigUi/TagsModule';

import EquipForm from '/client/components/forms/Equip/EquipForm';


const EquipSlide = ({ equipData, app, brancheS, isERun })=>{
  
  const eq = equipData;
  // safety
  
  // helmet-safety
  // scissors
  // shield
  // faucet-drip shower
  // wind
  // fire
  // bolt
  // radiation
  // biohazard
  // skull-crossbones
  // person-falling
  // hand-dots
  // mask-ventilator
  // mask-face
 
  return(
    <div className='section centre overscroll' key={eq.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap biggest'>{eq.equip}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide comfort'>
      
        
          
        {/*g.hibernate &&
          <div className='centreText comfort middle w100 vmargin wetasphaltBorder cap'>
            <i className='fas fa-archive fa-fw fa-2x wetasphaltT gapL'></i>
            <h3>{Pref.hibernatated} {Pref.group}</h3>
            <i className='fas fa-archive fa-fw fa-2x wetasphaltT gapR'></i>
          </div>*/}
      
          
        <div className='centreRow'>
          <EquipForm
            id={eq._id}
            name={eq.equip}
            alias={eq.alias}
            brKey={eq.branchKey}
            wiki={eq.instruct}
            rootURL={app.instruct}
            brancheS={brancheS}
            noText={false}
            primeTopRight={false}
            lockOut={!eq.online} />
         
        </div>
        
      </div>
      
      <p className='w100 capFL vmargin indenText wordBr'>
        {Pref.instruct} Index: {eq.instruct && eq.instruct.indexOf('http') === -1 ?
          app.instruct : null}<a className='clean wordBr' href={eq.instruct} target='_blank'>{eq.instruct}</a>
      </p>
      
      <div className='wide'>
        <CreateTag
          when={eq.createdAt}
          who={eq.createdWho}
          whenNew={eq.updatedAt}
          whoNew={eq.updatedWho}
          dbKey={eq._id} />
      </div>
    </div>
  );
};

export default EquipSlide;