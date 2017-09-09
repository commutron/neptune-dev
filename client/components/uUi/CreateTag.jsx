import React from 'react';
import moment from 'moment';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const CreateTag = ({ when, who, whenNew, whoNew }) => (
  <p className='small'><br />
    Last updated {moment(whenNew).format('MMMM Do YYYY, h:mm:ss a')} by <UserNice id={whoNew} />
    <br />
    Created {moment(when).format('MMMM Do YYYY, h:mm:ss a')} by <UserNice id={who} />
  </p>
);

export default CreateTag;