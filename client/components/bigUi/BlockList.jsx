import React from 'react';
import moment from 'moment';

import UserNice from '../smallUi/UserNice.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import {SolveBlock} from '../forms/BlockForm.jsx';
import {RemoveBlock} from '../forms/BlockForm.jsx';

const BlockList = ({ id, data, lock })=> {
  let blocks = data.sort((s1, s2) => {return s1.time < s2.time});
  if(blocks.length > 0) {
    return (
      <div className='blockerList'>
          {blocks.map( (entry, index)=>{
            return (
              <BlockRow key={index} entry={entry} id={id} lock={lock} />
          )})}
      </div>
    );
  }
  return (
    null
  );
};

const BlockRow = ({ entry, id, lock })=> {
  let dt = entry;
  let unlock = Roles.userIsInRole(Meteor.userId(), 'run');
  let solved = dt.solve && typeof dt.solve === 'object' &&
    <i>
      {dt.solve.action} - {moment(dt.solve.time).calendar()} by <UserNice id={dt.solve.who} />
    </i>;
  return(
		<div className='blockerCard'>
		  <div className='blockerHead'>
		    <span>{moment(dt.time).calendar()} by <UserNice id={dt.who} /></span>
		    <span>
  		    {unlock && !lock && !solved &&
            <SolveBlock id={id} blKey={dt.key} noText={true} />}
          {!lock && !solved &&
            <BlockForm id={id} edit={dt} smIcon={true} noText={true} />}
          {unlock && !lock && !solved &&
            <RemoveBlock id={id} blKey={dt.key} noText={true} />}
        </span>
		  </div>
      <div>
        {dt.block}
      </div>
      <div className='blockerSolve'>
        {solved}
      </div>
    </div>
  );
};

export default BlockList;