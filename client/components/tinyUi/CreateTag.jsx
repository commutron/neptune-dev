import React from 'react';
import moment from 'moment';
import Username from '/client/utility/Username.js';

const CreateTag = ({ when, who, whenNew, whoNew }) => (
  <p className='clean small indent fadeMore dropCeiling'>
    Last updated {moment(whenNew).format("YYYY/MM/DD, kk:mm:ss")} by <Username id={whoNew} />
    <br />
    Created {moment(when).format("YYYY/MM/DD, kk:mm:ss")} by <Username id={who} />
  </p>
);

export default CreateTag;