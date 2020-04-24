import React from 'react';
import moment from 'moment';
import Username from '/client/utility/Username.js';

const CreateTag = ({ when, who, whenNew, whoNew }) => (
  <p className='clean small fadeMore'>
    Created {moment(when).format("YYYY/MM/DD, kk:mm:ss")} by <Username id={who} />; 
    Last updated {moment(whenNew).format("YYYY/MM/DD, kk:mm:ss")} by <Username id={whoNew} />
  </p>
);

export default CreateTag;