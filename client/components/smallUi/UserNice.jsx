import React from 'react';
import Pref from '/client/global/pref.js';

const UserNice = ({ id })=> {
  const name = Meteor.users.findOne({_id : id});
  let nice = !name ? 'not found' :
              name.username.replace('.', ' ').replace('_', ' ');
  return(
    <i className='cap'>{nice}</i>
  );
};

export default UserNice;

export const AnonyUser = ({ id })=> {
  const isSelf = id === Meteor.userId();
  const peopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  
  if(Pref.userTimePublic || isSelf || peopleSuper) {
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