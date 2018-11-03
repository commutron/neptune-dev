import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import { ProWrap } from '/client/layouts/ProLayout.jsx';

import WikiOps from '../wiki/WikiOps.jsx';
import SearchHelp from './SearchHelp.jsx';

import ItemCard from './cards/ItemCard.jsx';
import BatchCard from './cards/BatchCard.jsx';
import XBatchCard from './cards/XBatchCard.jsx';
//import WidgetCard from './cards/WidgetCard.jsx';

import BatchesList from './lists/BatchesList.jsx';
import GroupsList from './lists/GroupsList.jsx';
import WidgetsList from './lists/WidgetsList.jsx';

export default class ProductionFindOps extends Component	{
  
  linkedBatch(wId, vKey) {
    return this.props.allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  }
  
  allLinkedBatches(wId) {
    return this.props.allBatch.filter(x => x.widgetId === wId);
  }
  
  groupActiveWidgets(gId) {
    let widgetsList = this.props.allWidget.filter(x => x.groupId === gId);
    let xActive = this.props.allxBatch.filter( b => b.completed === false);
    let legacyActive = this.props.allBatch.filter( b => b.finishedAt === false);
    const activeBatch = [...xActive, ...legacyActive ];
    
    const hasBatch = (id)=> activeBatch.find( b => b.widgetId === id) ? true : false;
    let activeWidgets = widgetsList.filter( w => hasBatch(w._id) == true );
    const activeList = Array.from(activeWidgets, w => w._id);
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
        <ProWrap standAlone={true}>
          <div className='centre wide'>
            <SearchHelp />
          </div>
        </ProWrap>
      );
    }

    // Easter eggs, hidden features or dark patterns \\
    if(orb === '.') {
      Session.set('nowBatch', false);
      return (
        <ProWrap standAlone={true}>
          <div className='centre'>
            <p>the special hell</p>
            {/*<img src='/titleLogo.svg' className='shadow noCopy' height='600' />*/}
          </div>
        </ProWrap>
      );
    }
    
    if(orb === Pref.batch || orb === Pref.batch + 's' || orb === Pref.btch) {
      Session.set('nowBatch', false);
      return (
        <ProWrap>
          <BatchesList batchData={[...allBatch, ...allxBatch]} widgetData={allWidget} />
          <div></div>
        </ProWrap>
      );
    }
    
    if(orb === Pref.group || orb === Pref.group + 's' || orb === Pref.grp) {
      Session.set('nowBatch', false);
      return (
        <ProWrap>
          <GroupsList groupData={allGroup} batchData={allBatch} widgetData={allWidget} />
          <div></div>
        </ProWrap>
      );
    }
    
    if(orb === Pref.docs || orb === 'docs' || orb === 'd') {
      Session.set('now', Pref.docs);
      Session.set('nowBatch', false);
      return (
        <ProWrap standAlone={true}>
          <WikiOps wi={false} root={app.instruct} anchor={false} full={true} />
        </ProWrap>
      );
    }

  // Batch
    if(!isNaN(orb) && orb.length === 5) {
      if(hotBatch) {
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        return (
			    <ProWrap
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
          </ProWrap>
        );
      }else if(hotxBatch) {
        let widget = this.linkedWidget(hotxBatch.widgetId);
        let version = this.versionData(widget.versions, hotxBatch.versionKey);
        let group = this.linkedGroup(hotxBatch.groupId);
        return (
			    <ProWrap
			      batchData={hotxBatch}
			      widgetData={widget}
            versionData={version}
            app={app}
            action='xBatchBuild'
            actionBar={true}
          >
            <XBatchCard
              batchData={hotxBatch}
              widgetData={widget}
              versionData={version}
              groupData={group}
              user={user}
              app={app} />
            <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
          </ProWrap>
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
          <ProWrap
            batchData={hotBatch}
            itemData={item}
            itemSerial={item.serial}
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
          </ProWrap>
        );
      }
    }

  // Group
    if(isNaN(orb)) {
      let alias = this.groupAlias();
      let lookup = alias ? alias : false;
      if(lookup) {
        Session.set('nowBatch', false);
        let widgets = this.groupWidgets(lookup._id);
        let activeWidgets = this.groupActiveWidgets(lookup._id);
        return (
          <ProWrap
            batchData={false}
            itemData={false}
            versionData={false}
            groupAlias={lookup.alias}
            app={app}
          >
            <WidgetsList
              groupAlias={lookup.alias}
              widgetData={widgets}
              active={activeWidgets} />
            <WikiOps wi={lookup.wiki} root={app.instruct} anchor={anchor} />
          </ProWrap>
        );
      }
    }
    
    // number that looks like a barcode but such a barcode does not exist
    if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
	    Session.set('nowBatch', orb);
	    return(
	      <ProWrap standAlone={true}>
          <div className='centre wide space'>
            <p className='big centerText'>{orb} is not a serial number</p>
            <hr />
            <SearchHelp />
          </div>
        </ProWrap>
	    );
	  }
    
    Session.set('nowBatch', false);
		return (
		  <ProWrap standAlone={true}>
        <div className='centre wide'>
          <p className='biggest'>¯\_(ツ)_/¯</p>
          <br />
          <SearchHelp />
        </div>
      </ProWrap>
    );
  }
}