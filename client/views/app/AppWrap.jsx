import React, {Component} from 'react';

import AccountPanel from './appPanels/AccountPanel.jsx';
import AccountsManagePanel from './appPanels/AccountsManagePanel.jsx';
import PrefPanel from './appPanels/PrefPanel.jsx';
import MetaPanel from './appPanels/MetaPanel.jsx';

import Tabs from '../../components/smallUi/Tabs.jsx';

export default class AppWrap extends Component	{

  render() {
    
    const admin = Roles.userIsInRole(Meteor.userId(), 'admin');
    
    if(admin) {
      return (
        <div id='view'>
          <div className='cardView'>
            
            <Tabs
              tabs={['profile', 'accounts', 'preferences', 'meta']}
              stick={true}>
              
              <AccountPanel key={1} />
              <AccountsManagePanel key={2} users={this.props.users} />
              <PrefPanel key={3} app={this.props.app} />
              <MetaPanel key={4} />
            </Tabs>
            
  				</div>
        </div>
      );
    }

    return (
      <div id='view'>
        <div className='cardView'>
          
          <Tabs
            tabs={['profile', 'meta']}
            stick={true}>
            
            <AccountPanel key={1} />
            <MetaPanel key={2} />
          </Tabs>
          
				</div>

      </div>
    );
  }
}