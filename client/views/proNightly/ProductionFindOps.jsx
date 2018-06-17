import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import { ProNightlyWrap } from './layout/ProNight.jsx';

import WikiOps from '../wiki/WikiOps.jsx';

import ItemCard from './cards/ItemCard.jsx';
import BatchCard from './cards/BatchCard.jsx';

export default class ProductionFindOps extends Component	{
  
  linkedBatch(wId, vKey) {
    return this.props.allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  }
  
  allLinkedBatches(wId) {
    return this.props.allBatch.filter(x => x.widgetId === wId);
  }
  
  groupActiveWidgets(gId) {
    let widgetsList = this.props.allWidget.filter(x => x.groupId === gId);
    let activeBatch = this.props.allBatch.filter( x => x.active === true);
    
    let activeList = [];
    for(let wdgt of widgetsList) {
      let match = activeBatch.find(x => x.widgetId === wdgt._id);
      match ? activeList.push(match.widgetId) : false;
    }
    return activeList;
  }
  
  itemData(items, bar) {
    return items.find(x => x.serial === bar);
  }
/*
  group() {
    return this.props.allGroup.find(x => x.group === this.props.orb);
  }
*/
  groupAlias() {
    return this.props.allGroup.find(x => x.alias === this.props.orb);
  }
  
  linkedGroup(gId) {
    return this.props.allGroup.find(x => x._id === gId);
  }
  
  widget() {
    return this.props.allWidget.find(x => x.widget === this.props.orb);
  }
  
  linkedWidget(wId) {
    return this.props.allWidget.find(x => x._id === wId);
  }
  
  groupWidgets(gId) {
    return this.props.allWidget.filter(x => x.groupId === gId);
  }
  
  versionData(versions, vKey) {
    return versions.find(x => x.versionKey === vKey);
  }

  render () {

    const orb = this.props.orb;
    const anchor = this.props.anchor;
    const user = this.props.user;
    const app = this.props.app;
    const allGroup = this.props.allGroup;
    const allWidget = this.props.allWidget;
    const allBatch = this.props.allBatch;
    const allxBatch = this.props.allxBatch;
    const hotBatch = this.props.hotBatch;
    const hotxBatch = this.props.hotxBatch;

    if(!orb) {
      Session.set('nowBatch', false);
      return (
        <div className='proFull'>
          <div className='centre wide'>
            
          </div>
        </div>
      );
    }

    // Easter eggs, hidden features or dark patterns \\
    if(orb === '.') {
      Session.set('nowBatch', false);
      return (
        <div className='proFull'>
          <div className='centre'>
            <p>the special hell</p>
            {/*<img src='/titleLogo.svg' className='shadow noCopy' height='600' />*/}
          </div>
        </div>
      );
    }
    
  // Batch
    if(!isNaN(orb) && orb.length === 5) {
      if(hotBatch) {
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        return (
			    <ProNightlyWrap
			      batchData={hotBatch}
			      widgetData={widget}
            versionData={version}
            app={app}
            action='batchBuild'
            actionBar={true}
          >
            <BatchCard
              batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group}
              user={user}
              app={app} />
            <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
          </ProNightlyWrap>
        );
      }
    }
  // Item
    ////// will need to be changed?? for alphnumeric barcodes such as with TGS
		if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
		  //let lookup = this.batchByItem();
      if(hotBatch) {
        let item = this.itemData(hotBatch.items, orb);
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        return (
          <ProNightlyWrap
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            versionData={version}
            users={this.props.users}
            app={app}
            actionBar={true}
          >
            <ItemCard
              batchData={hotBatch}
              itemData={item}
              widgetData={widget}
              users={this.props.users}
              app={app} />
            <BatchCard
              batchData={hotBatch}
              itemSerial={item.serial}
              widgetData={widget}
              versionData={version}
              groupData={group}
              user={user}
              app={app} />
            <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
          </ProNightlyWrap>
        );
      }
    }

    Session.set('nowBatch', false);
		return (
		  <div className='proFull'>
        <div className='centre wide'>
          <p className='biggest'>¯\_(ツ)_/¯</p>
        </div>
      </div>
    );
  }
}