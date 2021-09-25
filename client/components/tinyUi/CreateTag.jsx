import React from 'react';
import moment from 'moment';
import UserName from '/client/utility/Username.js';

const CreateTag = ({ when, who, whenNew, whoNew }) => (
  <p className='clean small indent darkgrayT dropCeiling'>
    Last updated {moment(whenNew).format("YYYY/MM/DD, kk:mm:ss")} by {UserName(whoNew)}
    <br />
    Created {moment(when).format("YYYY/MM/DD, kk:mm:ss")} by {UserName(who)}
  </p>
);

export default CreateTag;