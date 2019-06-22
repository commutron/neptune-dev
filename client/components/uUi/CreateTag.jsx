import React from 'react';
import moment from 'moment';
import UserName from '/client/components/uUi/UserName.jsx';

const CreateTag = ({ when, who, whenNew, whoNew }) => (
  <p className='clean small fadeMore'>
    Created {moment(when).format("YYYY/MM/DD, kk:mm:ss")} by <UserName id={who} />; 
    Last updated {moment(whenNew).format("YYYY/MM/DD, kk:mm:ss")} by <UserName id={whoNew} />
  </p>
);

export default CreateTag;