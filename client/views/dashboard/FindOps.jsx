import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import Dashboard from './Dashboard.jsx';

import WikiOps from '../wiki/WikiOps.jsx';
import SearchHelp from './SearchHelp.jsx';

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
    const hotBatch = this.props.hotBatch;

    if(!orb) {
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <div className='centre centreTrue wide'>
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
          <div className='centre wisper'>
            <p>the angels have the phone box</p>
            <img src='/titleLogo.svg' className='shadow noCopy' height='600' />
          </div>
        </div>
      );
    }
    
    if(orb === Pref.batch || orb === Pref.batch + 's' || orb === Pref.btch) {
      Session.set('nowBatch', false);
      return (
        <Dashboard>
          <BatchesList batchData={allBatch} />
          <div></div>
        </Dashboard>
      );
    }
    
    if(orb === Pref.group || orb === Pref.group + 's' || orb === Pref.grp) {
      Session.set('nowBatch', false);
      return (
        <Dashboard action='newGroup'>
          <GroupsList groupData={allGroup} />
          <div></div>
        </Dashboard>
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
    if(orb === Pref.docs || orb === 'docs' || orb === 'd') {
      Session.set('now', Pref.docs);
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <WikiOps wi={false} root={app.instruct} brick={false} />
        </div>
      );
    }

  // Batch
    if(!isNaN(orb) && orb.length === 5) {
      if(hotBatch) {
        let widget = this.linkedWidget(hotBatch.widgetId);
        let version = this.versionData(widget.versions, hotBatch.versionKey);
        let group = this.linkedGroup(widget.groupId);
        if(snap) {
          return (
  			    <Dashboard
  			      snap={snap}
  			      batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group} 
              app={app}
              action='batch'
            >
  			      <ItemsList batchData={hotBatch} tide={orb} />
              <BatchPanel
                batchData={hotBatch}
                widgetData={widget}
                versionData={version}
                groupData={group} 
                app={app} />
            </Dashboard>
            );
        }else{
          return (
  			    <Dashboard
  			      snap={snap}
  			      batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group}
              app={app}
              action='batchBuild'
            >
              <BatchCard
                batchData={hotBatch}
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
	    Session.set('nowBatch', orb);
	    return(
	      <div className='dashMainFull'>
	        <WikiOps
	          wi='home'
	          fallback={orb}
	          root={app.instruct}
	          brick={brick}
	          indie={true} />
	       </div>
	      );
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
        if(snap) {
          return (
          <Dashboard
            snap={snap}
            batchData={hotBatch}
            itemData={item}
            widgetData={widget}
            versionData={version}
            groupData={group}
            app={app}
            action='item'
          >
            <ItemsList batchData={hotBatch} tide={orb} />
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
          </Dashboard>
          );
        }else{
          return (
            <Dashboard
              snap={snap}
              batchData={hotBatch}
              itemData={item}
              widgetData={widget}
              versionData={version}
              groupData={group}
              app={app}
              action='build'
            >
              <div>
                <ItemCard
                  batchData={hotBatch}
                  itemData={item}
                  widgetData={widget}
                  users={this.props.users}
                  app={app} />
                <BatchCard
                  batchData={hotBatch}
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
        Session.set('nowBatch', false);
        let widgets = this.groupWidgets(lookup._id);
        let activeBatch = this.groupActiveBatches(lookup._id);
        if(snap) {
          return (
            <Dashboard
              snap={snap}
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
                active={activeBatch} />
              <GroupPanel groupData={lookup} />
            </Dashboard>
          );
        }else{
          return (
            <Dashboard
              snap={snap}
              batchData={false}
              itemData={false}
              widgetData={widgets}
              versionData={false}
              groupData={lookup}
              app={app}
            >
              <WidgetsList
                groupAlias={lookup.alias}
                widgetData={widgets}
                active={activeBatch} />
              <WikiOps wi={lookup.wiki} root={app.instruct} brick={brick} />
            </Dashboard>
          );
        }
      }
    }
    

  // Widget
  let lookup = this.widget(); // possible scope issue
    if(lookup) {
      Session.set('nowBatch', false);
      let group = this.linkedGroup(lookup.groupId);
      let allWidgets = this.groupWidgets(lookup.groupId);
      let allBatches = this.allLinkedBatches(lookup._id);
      let activeBatch = this.activeBatches(allBatches);
      if(snap) {
        return (
          <Dashboard
            snap={snap}
            batchData={false}
            itemData={false}
            widgetData={lookup}
            versionData={false}
            groupData={group}
            app={app}
            action='widget'
          >
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
            </div>
          </Dashboard>
          );
      }else{
        return (
          <Dashboard
            snap={snap}
            batchData={false}
            itemData={false}
            widgetData={lookup}
            versionData={false}
            groupData={group}
            app={app}
          >
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
    
    Session.set('nowBatch', false);
		return (
		  <div className='dashMainFull'>
        <div className='centre centreTrue wide'>
          <p className='biggest'>¯\_(ツ)_/¯</p>
          <SearchHelp />
        </div>
      </div>
    );
  }
}