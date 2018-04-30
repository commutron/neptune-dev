import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
//import Pref from '/client/global/pref.js';

import TopBar from './TopBar.jsx';
import TaskBar from './TaskBar.jsx';
import ActionBar from '/client/components/bigUi/ActionBar.jsx';
import CookieBar from './CookieBar.jsx';

export const ExploreLayout = ({content, link, subLink}) => (
  <div className='containerEx'>
    <div className='gridHeaderNav'>
      <TopBar link={link} />
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
          this.props.landing ? 'landingContainer' :
          this.props.user.miniAction === true ? 'traverseContainerMin' : 'traverseContainer'}>
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
          {this.props.children[0]}
        </section>
        
        <aside className='traverseList' style={scrollFix}>
          {this.props.children[1]}
        </aside>
        
        {( this.props.landing || !this.props.user.miniAction ) &&
          <div className='actionBarEx'>
            <ActionBar
              batchData={this.props.batchData}
              itemData={this.props.itemData}
              widgetData={this.props.widgetData}
              versionData={this.props.versionData}
              groupData={this.props.groupData}
              app={this.props.app}
              action={this.props.action} />
          </div>}
              
      </div>
    );
  }
}