import React from 'react';
import moment from 'moment';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const CreateTag = ({ when, who, whenNew, whoNew, dbKey}) => (
  <p className='clean small fade'>
    dB: {dbKey}; 
    Created {moment(when).format('MMMM Do YYYY, h:mm:ss a')} by <UserNice id={who} />; 
    Last updated {moment(whenNew).format('MMMM Do YYYY, h:mm:ss a')} by <UserNice id={whoNew} />
  </p>
);

export default CreateTag;