import React from 'react';
import moment from 'moment';

import UserNice from '../smallUi/UserNice.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import { SolveBlock } from '../forms/BlockForm.jsx';

const BlockList = ({ id, data, doneLock, truncate })=> {
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
                truncate={truncate} />
          )})}
      </div>
    );
  }
  return (
    null
  );
};

const BlockRow = ({ entry, id, doneLock, truncate })=> {
  let dt = entry;
  let unlock = Roles.userIsInRole(Meteor.userId(), 'run');
  let solved = dt.solve && typeof dt.solve === 'object';
    
  return(
		<div className='blockerCard'>
      <div>
        {dt.block}
        <legend>
  		    {!truncate &&
    		    <span className='middle'>
      		    {unlock && !solved &&
                <SolveBlock id={id} blKey={dt.key} noText={true} />}
              {unlock &&
                <BlockForm 
                  id={id} 
                  edit={dt} 
                  smIcon={true} 
                  noText={true}
                  doneLock={doneLock} />}
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