import React from 'react';
import moment from 'moment';
import UserName from '/client/components/uUi/UserName.jsx';

const CreateTag = ({ when, who, whenNew, whoNew }) => (
  <p className='clean small fade'>
    Created {moment(when).format('MMMM Do YYYY, h:mm:ss a')} by <UserName id={who} />; 
    Last updated {moment(whenNew).format('MMMM Do YYYY, h:mm:ss a')} by <UserName id={whoNew} />
  </p>
);

export default CreateTag;