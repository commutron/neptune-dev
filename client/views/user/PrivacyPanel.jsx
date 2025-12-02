import React from 'react';
import { toast } from 'react-toastify';
import PermissionHelp from '/client/views/people/PermissionHelp';

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
      
      {user.breadcrumbs?.length > 0 &&
      <div className='rightText'>
        <p>
          <button
            onClick={()=>clearthisUserCrumbs()}
            className='smallAction blackHover'
          >Clear your debug tracking data</button>
        </p>
      </div>}
    </div>
  );
};

export default PrivacyPanel;