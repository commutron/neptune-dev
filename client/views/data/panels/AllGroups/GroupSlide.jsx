import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
import WidgetsDepth from '../../lists/WidgetsDepth.jsx';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';

import GroupForm from '/client/components/forms/GroupForm.jsx';
import GroupHibernate from '/client/components/forms/GroupHibernate';
import WidgetNewForm from '/client/components/forms/WidgetNewForm.jsx';
import Remove from '/client/components/forms/Remove.jsx';


function groupActiveWidgets(gId, widgetsList, allXBatch) {
  
  let activeBatch = allXBatch.filter( b => b.completed === false);

  const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
  
  let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
  
  const activeList = Array.from(activeWidgets, w => w._id);
  return activeList;
}


const GroupSlide = ({ groupData, widgetsList, batchDataX, app })=>{
  
  const g = groupData;
  const active = groupActiveWidgets(g._id, widgetsList, batchDataX);
  
  return(
    <div className='section centre overscroll' key={g.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap biggest'>{g.group}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide comfort'>
      
        {g.hibernate &&
          <div className='wide centreText comfort middle wetasphaltBorder'>
            <i className='fas fa-archive fa-fw fa-2x'></i>
            <h3>Hibernated {Pref.group}</h3>
            <i className='fas fa-bed fa-fw fa-2x'></i>
          </div>}
        
        <div className='centreRow'>
          <TagsModule
            action='group'
            id={g._id}
            tags={g.tags}
            tagOps={app.tagOption} />
        </div>
          
        <div className='centreRow'>
          <GroupForm
            id={g._id}
            name={g.group}
            alias={g.alias}
            wiki={g.wiki}
            noText={false}
            primeTopRight={false}
            lockOut={g.hibernate} />
          <WidgetNewForm
            groupId={g._id}
            lock={g.hibernate} />
          <GroupHibernate
            id={g._id}
            hState={g.hibernate}
            noText={false}
            primeTopRight={false} />
          
          {!widgetsList || widgetsList.length === 0 ?
            <Remove
              action='group'
              title={g.group}
              check={g.createdAt.toISOString()}
              entry={g._id}
              noText={false}
              lockOut={g.hibernate !== true}
            />
          : null}
        </div>
        
      </div>
      
      <p className='capFL vmargin'>
        {Pref.instruct} index: <a className='clean wordBr' href={g.wiki} target='_blank'>{g.wiki}</a>
      </p>
        
      <WidgetsDepth
        groupAlias={g.alias}
        widgetData={widgetsList}
        active={active} />
      
      <div className='wide space edit'>
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

export default GroupSlide;