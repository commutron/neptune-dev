import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag.jsx';
import WidgetsDepth from '../../lists/WidgetsDepth.jsx';
import TagsModule from '/client/components/bigUi/TagsModule.jsx';

import GroupForm from '/client/components/forms/GroupForm.jsx';
import WidgetNewForm from '/client/components/forms/WidgetNewForm.jsx';
import Remove from '/client/components/forms/Remove.jsx';


function groupActiveWidgets(gId, widgetsList, allBatch, allXBatch) {
  
  let xActive = allXBatch.filter( b => b.completed === false);
  let legacyActive = allBatch.filter( b => b.finishedAt === false);
  const activeBatch = [...xActive, ...legacyActive ];

  const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
  
  let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
  
  const activeList = Array.from(activeWidgets, w => w._id);
  return activeList;
}


const GroupSlide = ({ groupData, widgetsList, batchData, batchDataX, app })=>{
  
  const g = groupData;
  const active = groupActiveWidgets(g._id, widgetsList, batchData, batchDataX);
  
  return(
    <div className='section centre overscroll' key={g.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap biggest'>{g.group}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide comfort'>
        
        <div className='centreRow'>
          {/*<span>
            <WatchButton 
              list={user.watchlist}
              type='group'
              keyword={g.alias} />
          </span>*/}
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
            primeTopRight={false} />
          <WidgetNewForm
            groupId={g._id}
            endTrack={app.lastTrack}  />
          <Remove
            action='group'
            title={g.group}
            check={g.createdAt.toISOString()}
            entry={g._id}
            noText={false} />
        </div>
        
      </div>
          
      <WidgetsDepth
        groupAlias={g.alias}
        widgetData={widgetsList}
        active={active} />

      <div className='wide space edit'>
        
        <p className='capFL'>
          {Pref.instruct} index: <a className='clean wordBr' href={g.wiki} target='_blank'>{g.wiki}</a>
        </p>
        
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