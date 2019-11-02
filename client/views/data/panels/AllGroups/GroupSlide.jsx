import React from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/uUi/CreateTag.jsx';
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
            id={g._id}
            tags={g.tags}
            vKey={false}
            group={true}
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
            end={app.lastTrack} 
            rootWI={app.instruct}
            noText={false} />
          <Remove
            action='group'
            title={g.group}
            check={g.createdAt.toISOString()}
            entry={g._id}
            noText={false} />
        </div>
        
      </div>
          
      <div className='wide space edit'>
        
        <p className='capFL'>
          {Pref.instruct} index: <a className='clean wordBr' href={g.wiki} target='_blank'>{g.wiki}</a>
        </p>
        
      </div>
          
      <WidgetsDepth
        groupAlias={g.alias}
        widgetData={widgetsList}
        active={active} />

      <CreateTag
        when={g.createdAt}
        who={g.createdWho}
        whenNew={g.updatedAt}
        whoNew={g.updatedWho}
        dbKey={g._id} />
    </div>
  );
};

export default GroupSlide;