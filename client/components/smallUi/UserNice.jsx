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

export const AnonyUser = ({ id })=> {
  const peopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const isSelf = id === Meteor.userId();
  
  if(peopleSuper || isSelf) {
    const name = Meteor.users.findOne({_id : id});
    let nice = 'not found';
    name ? nice = name.username : false;
    return (
      <i className='cap'>{nice}</i>
    );
  }else{
    const dateString = new Date().toISOString();
    const mod = parseInt(dateString.slice(-6, -5), 10);
    const isID = typeof id === 'string';
    const rndm = isID ? id.substr(mod, 2) : false;
    return (
      <i className='up'>{rndm}</i>
    );
  }
};