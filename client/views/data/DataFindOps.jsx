import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import DataWrap from './DataWrap.jsx';

import SearchHelp from './SearchHelp.jsx';

import ItemPanel from './panels/ItemPanel.jsx';
import BatchPanel from './panels/BatchPanel.jsx';
import WidgetPanel from './panels/WidgetPanel.jsx';
import GroupPanel from './panels/GroupPanel.jsx';
import BlockPanel from './panels/BlockPanel.jsx';
import ScrapPanel from './panels/ScrapPanel.jsx';

import BatchesList from './lists/BatchesList.jsx';
import ItemsList from './lists/ItemsList.jsx';
import GroupsList from './lists/GroupsList.jsx';
import WidgetsList from './lists/WidgetsList.jsx';

export default class DataFindOps extends Component	{
  
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

  group() {
    return this.props.allGroup.find(x => x.group === this.props.orb);
  }

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
    const app = this.props.app;
    const allGroup = this.props.allGroup;
    const allWidget = this.props.allWidget;
    const allBatch = this.props.allBatch;
    const hotBatch = this.props.hotBatch;

    if(!orb) {
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <div className='centre wide'>
            <SearchHelp />
          </div>
        </div>
      );
    }

    // Easter eggs, hidden features or dark patterns \\
    if(orb === '.') {
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <div className='centre'>
            <p>the angels have the phone box</p>
          </div>
        </div>
      );
    }
    
    if(orb === Pref.batch || orb === Pref.batch + 's' || orb === Pref.btch) {
      Session.set('nowBatch', false);
      return (
        <DataWrap>
          <BatchesList batchData={allBatch} widgetData={allWidget} />
          <div></div>
        </DataWrap>
      );
    }
    
    if(orb === Pref.group || orb === Pref.group + 's' || orb === Pref.grp) {
      Session.set('nowBatch', false);
      return (
        <DataWrap action='newGroup'>
          <GroupsList groupData={allGroup} batchData={allBatch} widgetData={allWidget} />
          <div></div>
        </DataWrap>
      );
    }
    
    if(orb === Pref.block || orb === Pref.blck) {
      Session.set('now', Pref.block);
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <BlockPanel batchData={allBatch} />
        </div>
      );
    }
    if(orb === Pref.scrap || orb === Pref.scrp) {
      Session.set('now', Pref.scrap);
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <ScrapPanel batchData={allBatch} />
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
			    <DataWrap
			      batchData={hotBatch}
            widgetData={widget}
            versionData={version}
            groupData={group} 
            app={app}
            action='batch'
          >
			      <ItemsList
			        batchData={hotBatch}
			        widgetData={widget}
			        tide={orb} />
            <BatchPanel
              batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group} 
              app={app} />
          </DataWrap>
        );
      }
    }
	  
  // Item
    //// barcode numbers are short durring dev but they will have to longer in production
    ////// this will also need to be changed???? for alphnumeric barcodes such as with TGS
		if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
		  //let lookup = this.batchByItem();
      if(hotBatch) {
        let item = this.itemData(hotBatch.items, orb);
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        return (
          <DataWrap
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            versionData={version}
            groupData={group}
            app={app}
            action='item'
          >
            <ItemsList
              batchData={hotBatch}
              widgetData={widget}
              tide={orb} />
            <div>
              <ItemPanel
                batchData={hotBatch}
                itemData={item}
                widgetData={widget}
                versionData={version}
                groupData={group}
                app={app}
                listTitle={true} />
            </div>
          </DataWrap>
        );
      }
    }

  // Group
    if(isNaN(orb)) {
      let alias = this.groupAlias();
      let group = this.group();
      let lookup = alias ? alias : group ? group : false;
      if(lookup) {
        Session.set('nowBatch', false);
        let widgets = this.groupWidgets(lookup._id);
        let activeWidgets = this.groupActiveWidgets(lookup._id);
        return (
          <DataWrap
            batchData={false}
            itemData={false}
            widgetData={widgets}
            versionData={false}
            groupData={lookup}
            app={app}
            action='group'
          >
            <WidgetsList
              groupAlias={lookup.alias}
              widgetData={widgets}
              active={activeWidgets} />
            <GroupPanel groupData={lookup} />
          </DataWrap>
        );
      }
    }

  // Widget
  let lookup = this.widget(); // possible scope issue
    if(lookup) {
      Session.set('nowBatch', false);
      let group = this.linkedGroup(lookup.groupId);
      let allWidgets = this.groupWidgets(lookup.groupId);
      let allBatches = this.allLinkedBatches(lookup._id);
      return (
        <DataWrap
          batchData={false}
          itemData={false}
          widgetData={lookup}
          versionData={false}
          groupData={group}
          app={app}
          action='widget'
        >
          <BatchesList
            batchData={allBatches}
            widgetData={allWidgets} />
          <div>
            <WidgetPanel
              widgetData={lookup}
              groupData={group}
              batchRelated={allBatches}
              app={app}
            />
          </div>
        </DataWrap>
      );
    }
    
    // number that looks like a barcode but such a barcode does not exist
    if(!isNaN(orb) && orb.length > 5 && orb.length <= 10) {
	    Session.set('nowBatch', orb);
	    return(
	      <div className='dashMainFull'>
          <div className='centre wide space'>
            <p className='big centerText'>{orb} {Pref.noSerial}</p>
            <hr />
            <SearchHelp />
          </div>
        </div>
	      );
	  }
    
    Session.set('nowBatch', false);
		return (
		  <div className='dashMainFull'>
        <div className='centre wide'>
          <p className='biggest'>¯\_(ツ)_/¯</p>
          <br />
          <SearchHelp />
        </div>
      </div>
    );
  }
}