import React from 'react';
import moment from 'moment';
import UserNice from '/client/components/smallUi/UserNice.jsx';

const CreateTag = ({ when, who }) => (
  <p className='small'><br />
    Created {moment(when).format('MMMM Do YYYY, h:mm:ss a')} by <UserNice id={who} />
  </p>
);

export default CreateTag;