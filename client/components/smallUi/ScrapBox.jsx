import React from 'react';
import moment from 'moment';
import UserNice from './UserNice.jsx';

import StepBack from '/client/components/river/StepBack.jsx';

const ScrapBox = ({ id, serial, entry, eX })=> {
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isQA = Roles.userIsInRole(Meteor.userId(), 'qa');
   
   return(
    <div className='actionBox red'>
      <div className='titleBar centre'>
        <h1 className='up'>{entry.type}</h1>
      </div>
      <div className='centre'>
        <p>{moment(entry.time).calendar()}</p>
        <p>by: <UserNice id={entry.who} />, at step: {entry.step}</p>
        <p className='capFL'>{entry.comm}</p>
        {eX && isAdmin && isQA ?
        <p>Undo Scrap Entry
          <StepBack
            id={id} 
            bar={serial} 
            entry={entry} 
            lock={!isAdmin || !isQA} />
        </p>
        : null}
        <br />
      </div>
    </div>
  );
};

export default ScrapBox;