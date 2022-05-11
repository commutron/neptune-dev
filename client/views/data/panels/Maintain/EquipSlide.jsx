import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import TagsModule from '/client/components/bigUi/TagsModule';

import EquipForm from '/client/components/forms/Equip/EquipForm';



const EquipSlide = ({ groupData, widgetsList, batchDataX, app, inter, isERun })=>{
  
  const g = groupData;
 
  return(
    <div className='section centre overscroll' key={g.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap biggest'>{g.group}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide comfort'>
      
        {g.internal &&
          <div className='centreText comfort middle w100 vmargin intrBlue cap'>
            <i className='fas fa-home fa-fw fa-2x logoBlueT gapL'></i>
            <h3>Internal {Pref.group}</h3>
            <i className='fas fa-globe-americas fa-fw fa-2x logoBlueT gapR'></i>
          </div>}
          
        {g.hibernate &&
          <div className='centreText comfort middle w100 vmargin wetasphaltBorder cap'>
            <i className='fas fa-archive fa-fw fa-2x wetasphaltT gapL'></i>
            <h3>{Pref.hibernatated} {Pref.group}</h3>
            <i className='fas fa-archive fa-fw fa-2x wetasphaltT gapR'></i>
          </div>}
        
        <div className='centreRow'>
          <TagsModule
            action='group'
            id={g._id}
            tags={g.tags}
            tagOps={app.tagOption}
            canRun={isERun} 
          />
        </div>
          
        <div className='centreRow'>
          <EquipForm
            id={g._id}
            name={g.group}
            alias={g.alias}
            wiki={g.wiki}
            rootURL={app.instruct}
            noText={false}
            primeTopRight={false}
            lockOut={g.hibernate} />
         
        </div>
        
      </div>
      
      <p className='w100 capFL vmargin indenText wordBr'>
        {Pref.instruct} Index: {g.wiki && g.wiki.indexOf('http') === -1 ?
          <n-sm>{app.instruct}</n-sm> : null}<a className='clean wordBr' href={g.wiki} target='_blank'>{g.wiki}</a>
      </p>
      
      <div className='wide'>
        <CreateTag
          when={g.createdAt}
          who={g.createdWho}
          whenNew={g.updatedAt}
          whoNew={g.updatedWho}
          dbKey={g._id} />
      </div>
    </div>
  );
};

export default EquipSlide;