import React from 'react';

import JumpText from '/client/components/tinyUi/JumpText.jsx';

import TagsModule from '/client/components/bigUi/TagsModule.jsx';
import BatchesList from '../lists/BatchesList.jsx';

const WidgetCard = ({ groupData, widgetData, batchRelated, app })=> {

  const g = groupData;
  const w = widgetData;
  const b = batchRelated;
  const a = app;
  
  const v = w.versions.sort((v1, v2)=> {
              if (v1.version < v2.version) { return 1 }
              if (v1.version > v2.version) { return -1 }
              return 0;
            });

  return(
    <div className='section sidebar' key={w.widget}>
      <div className='space'>
        <JumpText title={g.alias} link={g.alias} />
        <h2 className='cap'>{w.widget}</h2>
        <h3 className='cap'>{w.describe}</h3>
        <h3>
          {v.map( (entry)=>{
            let live = entry.live ? '' : 'fade';
            return(
              <span key={entry.versionKey}>
                <i className={live}>{entry.version}</i>
                <TagsModule
                  action='version'
                  id={w._id}
                  tags={entry.tags}
                  vKey={entry.versionKey}
                  tagOps={a.tagOption} />
                <i className='breath'></i>
              </span>
            )})}
        </h3>
        
      </div>
        
      <hr />
      
      <BatchesList
        batchData={b}
        widgetData={[w]} />
          
    </div>
  );
};

export default WidgetCard;