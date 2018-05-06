import React from 'react';
import moment from 'moment';

import UserNice from '../smallUi/UserNice.jsx';
import BlockForm from '../forms/BlockForm.jsx';
import {SolveBlock} from '../forms/BlockForm.jsx';
import {RemoveBlock} from '../forms/BlockForm.jsx';

const BlockList = ({ id, data, lock, expand })=> {
  let blocks = data.sort((s1, s2) => {return s1.time < s2.time});
  if(blocks.length > 0) {
    return (
      <div className='blockerList'>
          {blocks.map( (entry, index)=>{
            return (
              <BlockRow key={index} entry={entry} id={id} lock={lock} expand={expand} />
          )})}
      </div>
    );
  }
  return (
    null
  );
};

const BlockRow = ({ entry, id, lock, expand })=> {
  let dt = entry;
  let unlock = Roles.userIsInRole(Meteor.userId(), 'run');
  let solved = dt.solve && typeof dt.solve === 'object' &&
    <i>
      {moment(dt.solve.time).calendar()} <br /> {dt.solve.action} - <UserNice id={dt.solve.who} />
    </i>;
  return(
		<fieldset className='blockerCard'>
		  <legend className='blockerHead'>
		    <span>{moment(dt.time).calendar()}</span>
		    {expand &&
  		    <span>
    		    {unlock && !lock && !solved &&
              <SolveBlock id={id} blKey={dt.key} noText={true} />}
            {!lock && !solved &&
              <BlockForm id={id} edit={dt} smIcon={true} noText={true} />}
            {unlock && !lock && !solved &&
              <RemoveBlock id={id} blKey={dt.key} noText={true} />}
          </span>}
		  </legend>
      <div>
        {dt.block} - <UserNice id={dt.who} />
      </div>
      <div className='blockerSolve'>
        {solved}
      </div>
    </fieldset>
  );
};

export default BlockList;