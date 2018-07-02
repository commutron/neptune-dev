import React from 'react';

import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import AccountsManagePanel from './appPanels/AccountsManagePanel.jsx';
import PrefPanel from './appPanels/PrefPanel.jsx';

import Tabs from '../../components/smallUi/Tabs.jsx';

const AppWrap = ({ users, app })=> {
  
  const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
  
  return(
    <div className='simpleContainer'>
      <div className='tenHeader'>
        <div className='topBorder' />
        <HomeIcon />
        <div className='frontCenterTitle'>Settings</div>
        <div className='rightSpace' />
      </div>
    
      <div className='simpleContent'>
        
        
      {admin ?
          
        <Tabs
          tabs={['user permissions', 'preferences']}
          stick={true}
          wide={true}>
          
          <AccountsManagePanel key={1} users={users} />
          <PrefPanel key={2} app={app} />
        </Tabs>
        
        :
        
          <p className='medBig centreText'>This page is limited to administrators only</p>
        
      }
				
      </div>
    </div>
  );
};

export default AppWrap;