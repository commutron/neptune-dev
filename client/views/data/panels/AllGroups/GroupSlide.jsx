import React, { useMemo } from 'react';
import Pref from '/client/global/pref.js';
import CreateTag from '/client/components/tinyUi/CreateTag';
import WidgetsDepth from '../../lists/WidgetsDepth';
import TagsModule from '/client/components/bigUi/TagsModule';

import GroupForm from '/client/components/forms/Group/GroupForm';
import GroupHibernate from '/client/components/forms/Group/GroupHibernate';
import GroupInternal from '/client/components/forms/Group/GroupInternal';
import GroupEmails from '/client/components/forms/Group/GroupEmails';
import WidgetNewForm from '/client/components/forms/WidgetForm';
import Remove from '/client/components/forms/Remove';

import GroupTops from '/client/components/charts/GroupTops';

function groupActiveWidgets(widgetsList, allXBatch) {
  
  let activeBatch = allXBatch.filter( b => b.completed === false);

  const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
  
  let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
  
  const activeList = Array.from(activeWidgets, w => w._id);
  return activeList;
}


const GroupSlide = ({ groupData, widgetsList, batchDataX, app, inter, isERun })=>{
  
  const g = groupData;
  const active = useMemo(()=>groupActiveWidgets(widgetsList, batchDataX), [widgetsList, batchDataX]);
  const shrtI = g.wiki && !g.wiki.includes('http');
  
  const mockTag = {
    padding: '3px 7px 3px 5px',
    borderRadius: '1px 25px 25px 1px',
    backgroundColor: 'var(--nephritis)',
    fontSize: '0.9rem',
    color: 'white'
  };
  
  return(
    <div className='section centre overscroll' key={g.alias}>
      
      <div className='wide centreText'>
        <h1 className='cap bigger'>{g.group}</h1>
        
        <hr className='vmargin' />
      </div>
      
      <div className='wide comfort'>
      
        {g.internal &&
          <div className='centreText comfort middle w100 vmargin intrBlueSq cap'>
            <i className='fas fa-home fa-fw fa-2x nT gapL'></i>
            <h3>Internal {Pref.group}</h3>
            <i className='fas fa-globe-americas fa-fw fa-2x nT gapR'></i>
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
          <GroupForm
            id={g._id}
            name={g.group}
            alias={g.alias}
            wiki={g.wiki}
            rootURL={app.instruct}
            noText={false}
            primeTopRight={false}
            lockOut={g.hibernate} />
          <WidgetNewForm
            fresh={true}
            groupId={g._id}
            lockOut={g.hibernate}
          />
            
          <GroupEmails
            groupData={g}
          />
          
          {inter &&
            <GroupInternal
              id={g._id}
              iState={g.internal}
              noText={false}
              primeTopRight={false}
              access={isERun}
            />
          }
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
              lockOut={g.hibernate !== true ? 'still active' : false}
            />
          : null}
        </div>
        
      </div>
      
      {groupData.emailOptIn &&
        <p className='w100 indenText'>
        <span style={mockTag}>
          <i className="fa-solid fa-envelope-circle-check fa-lg gapR"></i>Automated Emails Enabled
        </span>
        </p>
      }
      
      <p className='w100 capFL indenText wordBr'>
        {Pref.instruct} Index: {shrtI ? app.instruct : null
        }<a className='clean wordBr' href={shrtI ? app.instruct + g.wiki : g.wiki} target='_blank'>{g.wiki}</a>
      </p>
      
      <GroupTops groupId={g._id} alias={g.alias} app={app} />
        
      <WidgetsDepth
        groupAlias={g.alias}
        widgetData={widgetsList}
        active={active} />
      
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

export default GroupSlide;