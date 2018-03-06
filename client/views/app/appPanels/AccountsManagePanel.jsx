import React from 'react';
import Pref from '/client/global/pref.js';

import UserForm from '/client/components/forms/UserForm.jsx';
import RemoveUser from '/client/components/forms/RemoveUser.jsx';

const AccountsManagePanel = ({ users })=> {
    
  const roles = [
    'nightly',
    'qa',
    'remove',
    'create',
    'edit',
    'run',
    'finish',
    'test',
    'inspect',
    'active'
    ];
  
  return (
    <div className='section'>
      <div className='space balance'>
        <div>
          <h2>User Accounts</h2>
            <ul>
              {users.map( (entry)=>{
                return (
                  <li key={entry._id}>
                    <UserForm
                      id={entry._id}
                      name={entry.username}
                      org={entry.org}
                      roles={roles}
                    />
                    {!Roles.userIsInRole(entry._id, 'active') &&
                      entry._id !== Meteor.userId() &&
                      !entry.org ?
                        <RemoveUser userID={entry._id} />
                    :null}
                    <br />
                    <br />
                  </li>
                  );
              })}
            </ul>
        </div>
        <div>
          <PermissionHelp roles={roles} admin={true} />
        </div>
      </div>
    </div>
  );
};

export const PermissionHelp = ({ roles, admin })=> {
  let r = roles;
  return(
    <div>
    
      <h2>Permissions</h2>
      
      {admin ?
        <ul>
          <li><b>Admin</b></li>
          <ul>
            <li>Activate or de-activate users</li>
            <li>Set user permissions</li>
            <li>Change user passwords</li>
            <li>Set app preferences</li>
          </ul>
        </ul>
      : null}
        
      {r.includes('qa') ?
        <ul>
          <li><b>QA</b></li>
          <ul>
            <li>Create and edit {Pref.rmaProcess}es</li>
            <li><i className='cap'>{Pref.scrap}</i> a {Pref.item}</li>
            <li>Add {Pref.escape}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('remove') ?
        <ul>
          <li><b>Remove</b></li>
          <ul>
            <li>Remove a {Pref.group}, {Pref.widget}, {Pref.version} *</li>
            <li>Remove a {Pref.batch}, {Pref.item}, or nonconformace *</li>
            <p className='small'>* subject to "in-use" checks</p> 
          </ul>
        </ul>
      : null}
        
      {r.includes('create') ?
        <ul>
          <li><b>Create</b></li>
          <ul>
            <li>Create a new {Pref.group}, {Pref.widget} or {Pref.version}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('edit') ?
        <ul>
          <li><b>Edit</b></li>
          <ul>
            <li>Edit {Pref.group} or {Pref.widget} names or descriptions</li>
            <li>Edit {Pref.widget} notes</li>
            <li>Add or edit a {Pref.widget} {Pref.version}</li>
            <li>Add or edit or remove* a {Pref.flow}</li>
            <li>Mark a process step as {Pref.ng}</li>
            <p className='small'>* subject to "in-use" checks</p> 
          </ul>
        </ul>
      : null}
        
      {r.includes('run') ?
        <ul>
          <li><b>Run</b></li>
          <ul>
            <li>Edit {Pref.batch} name or dates</li>
            <li>Add or Remove {Pref.tag}s</li>
            <li>Edit {Pref.batch} notes</li>
            <li>Create new {Pref.itemSerial}s</li>
            <li>Change {Pref.unit}</li>
            <li>Set a {Pref.batch} {Pref.flow}</li>
            <li>Add {Pref.block}s</li>
            <li>Skip/ship nonconformaces</li>
            <li>Add {Pref.escape}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('finish') ?
        <ul>
          <li><b>Finish</b></li>
          <ul>
            <li><i className='cap'>{Pref.trackLast}</i> a {Pref.item}</li>
          </ul>
        </ul>
      : null}
        
      {r.includes('test') ?
        <ul>
          <li><b>Test</b></li>
          <ul>
            <li>Record "Test" steps</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('inspect') ?
        <ul>
          <li><b>Inspect</b></li>
          <ul>
            <li>Record "First" and "Inspect" steps</li>
            <li>Record "Inspected" nonconformaces</li>
            <li>Edit nonconformaces</li>
            <li>Snooze and re-activate nonconformaces</li>
            <li>Active an {Pref.rmaProcess} on a {Pref.item}</li>
          </ul>
        </ul>
      : null}
      
      {r.includes('active') ?
        <ul>
          <li><b>Active</b></li>
          <ul>
            <li>View {Pref.group} and {Pref.batch} information</li>
            <li>Record "Build" steps</li>
            <li>Record nonconformaces</li>
            <li>Record "Repaired" nonconformaces</li>
          </ul>
        </ul>
      : null}
      
    </div>
  );
};

export default AccountsManagePanel;