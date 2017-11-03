import React from 'react';

function find(id) {
  const user = Meteor.users.findOne({_id : id});
  let nice = 'not found';
  user ? nice = user.username : false;
  return nice;
}
    
const UserName = ({ id }) => (
  <i className='cap'>{find(id)}</i>
);

export default UserName;