import React from 'react';
import moment from 'moment';

import UserNice from '/client/components/smallUi/UserNice';
import StepBackX from '/client/components/bigUi/ItemFeedX/StepBackX';

const ScrapBox = ({ seriesId, serial, entry, eX })=> {
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isQA = Roles.userIsInRole(Meteor.userId(), 'qa');
   
   return(
    <div className='actionBox scrapBanner red vgap'>
      <div className='titleBar centre'>
        <h1 className='up'>{entry.type}</h1>
      </div>
      <div className='centre'>
        <p>{moment(entry.time).calendar()}</p>
        <p>by: <UserNice id={entry.who} />, at step: {entry.step}</p>
        <p className='capFL'>{entry.comm}</p>
        {eX && isAdmin && isQA ?
        <p>Undo Scrap Entry
          <StepBackX
            seriesId={seriesId} 
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