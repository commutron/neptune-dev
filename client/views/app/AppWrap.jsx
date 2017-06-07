import React, {Component} from 'react';

import PrefPanel from './appPanels/PrefPanel.jsx';
import AccountsPanel from './appPanels/AccountsPanel.jsx';

import Tabs from '../../components/smallUi/Tabs.jsx';

export default class AppWrap extends Component	{

  render() {

    return (
      <div id='view'>
        <div className='cardView'>
          
          <Tabs
            tabs={['help', 'accounts', 'preferences']}
            stick={true}>
            
            <div>help</div>
            <AccountsPanel users={this.props.users} />
            <PrefPanel app={this.props.app} />
          </Tabs>
          
				</div>

      </div>
    );
  }
}