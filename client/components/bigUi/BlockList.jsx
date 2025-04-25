import React from 'react';
import moment from 'moment';

import UserNice from '../smallUi/UserNice.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import { SolveBlock } from '../forms/BlockForm.jsx';

const BlockList = ({ id, data, doneLock, truncate, canRun })=> {
  let blocks = data.sort((s1, s2) => s1.time < s2.time);
  if(blocks.length > 0) {
    return (
      <div className='blockerList'>
          {blocks.map( (entry, index)=>{
            return (
              <BlockRow 
                key={index}
                entry={entry}
                id={id}
                doneLock={doneLock} 
                truncate={truncate}
                canRun={canRun}
              />
          )})}
      </div>
    );
  }
  return(
    null
  );
};

const BlockRow = ({ entry, id, doneLock, truncate, canRun })=> {
  let dt = entry;
  let unlock = canRun;
  let solved = dt.solve && typeof dt.solve === 'object';
    
  return(
		<div className='blockerCard'>
      <div>
        {dt.block}
        <legend>
  		    {!truncate &&
    		    <span className='beside'>
      		    {unlock && !solved &&
                <SolveBlock 
                  id={id} 
                  blKey={dt.key} 
                  noText={true} 
                  canRun={canRun}
                />
      		    }
              {unlock &&
                <BlockForm 
                  id={id} 
                  edit={dt} 
                  smIcon={true} 
                  noText={true}
                  doneLock={doneLock}
                  canRun={canRun}
                />
              }
            </span>}
            <span>{moment(dt.time).calendar()} - <UserNice id={dt.who} /></span>
  		  </legend>
		  </div>
      {solved &&
        <em>
          {dt.solve.action}
          <legend>
            <span>{moment(dt.solve.time).calendar()} - <UserNice id={dt.solve.who} /></span>
          </legend>
        </em>
      }
    </div>
  );
};

export default BlockList;