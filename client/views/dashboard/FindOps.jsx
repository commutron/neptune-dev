import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Dashboard from './Dashboard.jsx';

import WikiOps from '../wiki/WikiOps.jsx';

import ItemCard from './cards/ItemCard.jsx';
import BatchCard from './cards/BatchCard.jsx';
// import BatchDoneCard from './cards/BatchDoneCard.jsx';
import WidgetCard from './cards/WidgetCard.jsx';

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

export default class FindOps extends Component	{

  batch() {
    return this.props.allBatch.find(x => x.batch === this.props.orb);
  }
  
  linkedBatch(wId, vKey) {
    return this.props.allBatch.find(x => x.widgetId === wId, x => x.versionKey === vKey);
  }
  
  allLinkedBatches(wId) {
    return this.props.allBatch.filter(x => x.widgetId === wId);
  }
  
  activeBatches(batches) {
    batchList = [];
    let active = batches.filter(x => x.active === true);
    for(let b of active) {
      batchList.push(b.batch);
    }
    return batchList;
  }
  
  groupActiveBatches(gId) {
    let widgetsList = this.props.allWidget.filter(x => x.groupId === gId);
    batchList = [];
    for(let widget of widgetsList) {
      let match = this.props.allBatch.find(x => x.widgetId === widget._id, x => x.active === true);
      match ? batchList.push(match.batch) : false;
    }
    return batchList;
  }
  
  
  batchByItem() { // this functions reactivly here but maybe would better if moved up to DataWrap
    return BatchDB.findOne({'items.serial': this.props.orb});
  }
  /*
  batchByItem() {
    return this.props.allBatch.find(x => x.items.serial === this.props.orb);
  }
  */
  
  doneBatch() {
    // archive search
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

    const snap = this.props.snap;
    const orb = this.props.orb;
    const brick= this.props.brick;
    const app = this.props.app;
    const allGroup = this.props.allGroup;
    // const allWidget = this.props.allWidget;
    const allBatch = this.props.allBatch;

    if(!orb) {
      return (
        <Dashboard>
          <div></div>
          <div className='centre'>
            <p>ready</p>
          </div>
        </Dashboard>
      );
    }

    // Easter eggs, hidden features or dark patterns \\
    if(orb === '') {
      return (
        <Dashboard>
          <div className='centre'><p>the angels have the phone box</p></div>
          <div></div>
        </Dashboard>
      );
    }
    
    if(orb === Pref.batch) {
      return (
        <Dashboard>
          <BatchesList batchData={allBatch} />
          <div></div>
        </Dashboard>
      );
    }
    
    if(orb === Pref.group) {
      return (
        <Dashboard>
          <GroupsList groupData={allGroup} />
          <div></div>
        </Dashboard>
      );
    }
    
    if(orb === Pref.block) {
      Session.set('now', Pref.block);
      return (
        <BlockPanel batchData={allBatch} />
      );
    }
    if(orb === Pref.scrap) {
      Session.set('nowPanel', Pref.scrap);
      return (
        <ScrapPanel batchData={allBatch} />
      );
    }

  // Batch
    if(!isNaN(orb) && orb.length === 5) {
      let lookup = this.batch();
      if(lookup) {
        let widget = this.linkedWidget(lookup.widgetId);
        let version = this.versionData(widget.versions, lookup.versionKey);
        let group = this.linkedGroup(widget.groupId);
        if(snap) {
          return (
  			    <Dashboard app={app}>
  			      <ItemsList batchData={lookup} tide={orb} />
              <BatchPanel
                batchData={lookup}
                widgetData={widget}
                versionData={version}
                groupData={group} 
                app={app}/>
            </Dashboard>
            );
        }else{
          return (
  			    <Dashboard>
              <BatchCard
                batchData={lookup}
                widgetData={widget}
                versionData={version}
                groupData={group} />
              <WikiOps wi={version.wiki} root={app.instruct} brick={brick} />
            </Dashboard>
            );
        }
      }
    }
    
    // archive search
        
	  
	  // Fallback to 'PISCES' -- for the transition
	  //// supufoulous once 'neptune' is used exclusivly
	  if(!isNaN(orb) && orb.length === 5) {
	    return(
	      <WikiOps wi='home' fallback={orb} root={app.instruct} brick={brick} />
	      );
	  }
	  
  // Item
    //// barcode numbers are short durring dev but they will have to longer in production
    ////// this will also need to be changed???? for alphnumeric barcodes such as with TGS
		if(!isNaN(orb) && orb.length > 5 && orb.length <= 12) {
		  let lookup = this.batchByItem();
      if(lookup) {
        let item = this.itemData(lookup.items, orb);
        let widget = this.linkedWidget(lookup.widgetId);
        let version = this.versionData(widget.versions, lookup.versionKey);
        let group = this.linkedGroup(widget.groupId);
        if(snap) {
          return (
          <Dashboard>
            <ItemsList batchData={lookup} tide={orb} />
            <div>
              <ItemPanel
                batchData={lookup}
                itemData={item}
                app={app}
                listTitle={true} />
              <BatchPanel
                batchData={lookup}
                widgetData={widget}
                versionData={version}
                groupData={group}
                app={app} />
            </div>
          </Dashboard>
          );
        }else{
          return (
            <Dashboard>
              <div>
                <ItemCard
                  batchData={lookup}
                  itemData={item}
                  widgetData={widget}
                  users={this.props.users}
                  app={app} />
                <BatchCard
                  batchData={lookup}
                  widgetData={widget}
                  versionData={version}
                  groupData={group} />
              </div>
              <WikiOps wi={version.wiki} root={app.instruct} brick={brick} />
            </Dashboard>
          );
        }
      }
    }

  // Group
    if(isNaN(orb)) {
      let alias = this.groupAlias();
      let group = this.group();
      let lookup = alias ? alias : group ? group : false;
      if(lookup) {
        let widgets = this.groupWidgets(lookup._id);
        let activeBatch = this.groupActiveBatches(lookup._id);
        if(snap) {
          return (
            <Dashboard>
              <WidgetsList
                groupAlias={lookup.alias}
                widgetData={widgets}
                active={activeBatch} />
              <GroupPanel groupData={lookup} end={app.lastTrack} root={app.instruct} />
            </Dashboard>
          );
        }else{
          return (
            <Dashboard>
              <WidgetsList
                groupAlias={lookup.alias}
                widgetData={widgets}
                active={activeBatch} />
              <WikiOps widget='home' wi='home' root={app.instruct} brick={brick} />
            </Dashboard>
          );
        }
      }
    }
    

  // Widget
  let lookup = this.widget(); // possible scope issue
    if(lookup) {
      let group = this.linkedGroup(lookup.groupId);
      let allWidgets = this.groupWidgets(lookup.groupId);
      let allBatches = this.allLinkedBatches(lookup._id);
      let activeBatch = this.activeBatches(allBatches);
      if(snap) {
        return (
          <Dashboard>
            <WidgetsList
              groupAlias={group.alias}
              widgetData={allWidgets}
              active={activeBatch}
              listTitle={true} />
            <div>
              <WidgetPanel
                widgetData={lookup}
                groupData={group}
                batchRelated={allBatches}
                app={app}
              />
              <GroupPanel groupData={group} end={app.lastTrack} root={app.instruct} />
            </div>
          </Dashboard>
          );
      }else{
        return (
          <Dashboard>
            <div>
              <WidgetCard
                groupData={group}
                widgetData={lookup}
                batchRelated={allBatches}
              />
            </div>
            <WikiOps
              wi={lookup.versions[lookup.versions.length - 1].wiki} // newest version
              root={app.instruct}
              brick={brick} />
          </Dashboard>
        );
      }
    }

		return (
		  <Dashboard>
        <div></div>
        <div className='centre'><p>¯\_(ツ)_/¯</p></div>
      </Dashboard>
    );
  }
}