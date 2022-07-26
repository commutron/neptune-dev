import React from 'react';
import { toast } from 'react-toastify';
import { PermissionHelp } from '/client/views/people/AccountsManagePanel';

const PrivacyPanel = ({ app, user, isAdmin })=> {
  
  function clearthisUserCrumbs() {
    Meteor.call('clearBreadcrumbsRepair', (error, reply)=>{
      error && console.log(error);
      if(reply) { toast.success('data edit complete'); }
    });
  }
  
  return(
    <div>
      <PermissionHelp auths={Meteor.user().roles} admin={isAdmin} />
      
      <hr />
      
      <div>
        <p>Saved usage behaviour for {user.username}</p>
      </div>
      <p>
        <button
          onClick={()=>clearthisUserCrumbs()}
          className='action blackHover'
        >Clear Your breadcrumbs</button>
      </p>
      
    </div>
  );
};

export default PrivacyPanel;