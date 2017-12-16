import React from 'react';

const UserNice = ({ id })=> {
  const name = Meteor.users.findOne({_id : id});
  let nice = 'not found';
  name ? nice = name.username : false;
  return (
    <i className='cap'>{nice}</i>
  );
};

export default UserNice;