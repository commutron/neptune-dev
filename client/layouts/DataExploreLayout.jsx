import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
//import Pref from '/client/global/pref.js';

import TopBar from './TopBar.jsx';
import HomeIcon from '/client/components/uUi/HomeIcon.jsx';
import TaskBar from './TaskBar.jsx';
import ActionBar from '/client/components/bigUi/ActionBar.jsx';
import CookieBar from './CookieBar.jsx';

export const ExploreLayout = ({content, subLink}) => (
  <div className='containerEx'>
    <div className='tenHeader'>
      <div className='topBorder' />
      <HomeIcon />
      <div className='frontCenterTitle'>Data Explore</div>
      <div className='rightSpace'>
        
      </div>
    </div>
    <aside className='taskBarEx'>
      <TaskBar subLink={subLink} />
    </aside>
    <section className='contentAreaEx'>
      {content}
    </section>
  </div>
);

export class TraverseWrap extends Component	{

  render() {
    
    let scrollFix = {
      overflowY: 'auto'
    };

    return (
      <div 
        className={
          this.props.landing ? 
            'landingContainer' :
          !this.props.children[1] ?
            this.props.user.miniAction === true ? 
              'baseTraverseContainerMin' : 'baseTraverseContainer' :
          this.props.user.miniAction === true ? 
            'traverseContainerMin' : 'traverseContainer'}>
        <div 
          className={
            //!this.props.user.miniAction &&
            this.props.landing ? 'hidden' : 'cookieNavEx'}>
          <CookieBar
            batchData={this.props.batchData}
            itemData={this.props.itemData}
            widgetData={this.props.widgetData}
            versionData={this.props.versionData}
            groupData={this.props.groupData}
            app={this.props.app}
            action={this.props.action}
            miniAction={this.props.user.miniAction} />
        </div>
        
        <section className='traverseContent' style={scrollFix}>
          {this.props.children[0] || this.props.children}
        </section>
        
        {this.props.children[1] &&
          <aside className='traverseList' style={scrollFix}>
            {this.props.children[1]}
          </aside>}
        
        {( this.props.landing || !this.props.user.miniAction ) &&
          <div className='actionBarEx'>
            <ActionBar
              batchData={this.props.batchData}
              itemData={this.props.itemData}
              groupData={this.props.groupData}
              widgetData={this.props.widgetData}
              versionData={this.props.versionData}
              app={this.props.app}
              action={this.props.action} />
          </div>}
              
      </div>
    );
  }
}