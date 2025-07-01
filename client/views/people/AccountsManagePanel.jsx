import React, { Fragment } from 'react';
import Pref from '/public/pref.js';

import SlidesNested from '/client/layouts/TaskBars/SlidesNested';

import DeleteUser from '/client/components/forms/User/DeleteUser';

import Tabs from '/client/components/smallUi/Tabs/Tabs';
import AccountsTop from './AccountsTop';
import ActivityPanel from '/client/views/user/ActivityPanel';
import UserManageForm from '/client/components/forms/User/UserManageForm';

import { ForceStopEngage } from '/client/views/app/appSlides/DataRepair';

const AccountsManagePanel = ({ app, users, traceDT, brancheS, isDebug })=> {
  
  const usersSort = users.sort((user1, user2)=> {
          let u1 = user1.username.substr(0, 4).toLowerCase();
          let u2 = user2.username.substr(0, 4).toLowerCase();
          if (!Roles.userIsInRole(user1._id, 'active')) { return 1 }
          if (!Roles.userIsInRole(user2._id, 'active')) { return -1 }
          if (u1.username < u2.username) { return -1 }
          if (u1.username > u2.username) { return 1 }
          return 0;
        });
  
  let usersMenu = usersSort.map( (entry)=>{
    const strk = !Roles.userIsInRole(entry._id, 'active');
    const sbtl = Roles.userIsInRole(entry._id, 'admin') ? 'Org Admin' : 
                 Roles.userIsInRole(entry._id, 'peopleSuper') ? 'People Super' :
                 Roles.userIsInRole(entry._id, 'equipSuper') ? 'Equipment Super' :
                 Roles.userIsInRole(entry._id, 'readOnly') ? 'Read Only' : null;
    return [ entry.username, strk, sbtl ];
  });
  
  const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
  const isPeopleSuper = Roles.userIsInRole(Meteor.userId(), 'peopleSuper');
  const noAccess = <div className='centreText'>Permission Denied</div>;
  
  return (
    <SlidesNested
      menuTitle='User Accounts'
      menu={usersMenu}
      disableAll={!isAdmin && !isPeopleSuper}
      topPage={
        <AccountsTop users={usersSort} key={000} />
      }
      collapse='Inactive'>
        
      {usersSort.map( (entry, index)=>{
        if(isAdmin || isPeopleSuper) {
          return(
            <div key={index+entry._id}>
              <Tabs
                tabs={[
                  <b><i className='far fa-clock fa-fw'></i>   Time</b>,
                  <b><i className='fas fa-key fa-fw'></i>  Access</b>,
                ]}
                wide={true}
                hold={false}
                disable={[ (!isPeopleSuper && !isAdmin), !isAdmin, (!isPeopleSuper && !isAdmin)]}>
                
                <ActivityPanel
                  key={0}
                  app={app}
                  brancheS={brancheS}
                  user={entry}
                  isDebug={isDebug}
                  users={usersSort}
                  traceDT={traceDT} />
                
                <div key={1}>
                {isAdmin ?
                  <Fragment>
                    <UserManageForm
                      userObj={entry}
                      id={entry._id}
                      name={entry.username}
                      org={entry.org}
                      keys={Pref.keys}
                      power={Pref.power}
                      auths={Pref.auths}
                      areas={Pref.areas}
                      brancheS={brancheS}
                    />
                    {!Roles.userIsInRole(entry._id, 'active') &&
                      entry._id !== Meteor.userId() && !entry.org ?
                        <DeleteUser userID={entry._id} />
                    :null}
                    
                    {isAdmin && isDebug && entry.engaged !== false ?
                      <ForceStopEngage 
                        userID={entry._id}
                        isAdmin={isAdmin}
                        isDebug={isDebug} />
                    :null}
                  </Fragment>
                : noAccess}
                </div>
              </Tabs>
            </div>
          );
        }else{
          return noAccess;
        }
      })}
    </SlidesNested>
  );
};

export default AccountsManagePanel;