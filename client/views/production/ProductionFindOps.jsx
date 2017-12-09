import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ProductionWrap from './ProductionWrap.jsx';

import WikiOps from '../wiki/WikiOps.jsx';
import SearchHelp from './SearchHelp.jsx';

import ItemCard from './cards/ItemCard.jsx';
import BatchCard from './cards/BatchCard.jsx';
import WidgetCard from './cards/WidgetCard.jsx';

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
    const anchor= this.props.anchor;
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
            <p>the special hell</p>
            {/*<img src='/titleLogo.svg' className='shadow noCopy' height='600' />*/}
          </div>
        </div>
      );
    }
    
    if(orb === Pref.batch || orb === Pref.batch + 's' || orb === Pref.btch) {
      Session.set('nowBatch', false);
      return (
        <ProductionWrap>
          <BatchesList batchData={allBatch} widgetData={allWidget} />
          <div></div>
        </ProductionWrap>
      );
    }
    
    if(orb === Pref.group || orb === Pref.group + 's' || orb === Pref.grp) {
      Session.set('nowBatch', false);
      return (
        <ProductionWrap>
          <GroupsList groupData={allGroup} batchData={allBatch} widgetData={allWidget} />
          <div></div>
        </ProductionWrap>
      );
    }
    
    if(orb === Pref.docs || orb === 'docs' || orb === 'd') {
      Session.set('now', Pref.docs);
      Session.set('nowBatch', false);
      return (
        <div className='dashMainFull'>
          <WikiOps wi={false} root={app.instruct} anchor={false} />
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
			    <ProductionWrap
			      batchData={hotBatch}
            versionData={version}
            app={app}
            action='batchBuild'
          >
            <BatchCard
              batchData={hotBatch}
              widgetData={widget}
              versionData={version}
              groupData={group}
              app={app} />
            <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
          </ProductionWrap>
        );
      }
    }
	  
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
	          anchor={anchor}
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
        return (
          <ProductionWrap
            batchData={hotBatch}
            itemData={item}
            versionData={version}
            app={app}
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
                groupData={group}
                app={app} />
            </div>
            <WikiOps wi={version.wiki} root={app.instruct} anchor={anchor} />
          </ProductionWrap>
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
          <ProductionWrap
            batchData={false}
            itemData={false}
            versionData={false}
            app={app}
          >
            <WidgetsList
              groupAlias={lookup.alias}
              widgetData={widgets}
              active={activeWidgets} />
            <WikiOps wi={lookup.wiki} root={app.instruct} anchor={anchor} />
          </ProductionWrap>
        );
      }
    }
    

  // Widget
  let lookup = this.widget(); // possible scope issue
    if(lookup) {
      Session.set('nowBatch', false);
      let group = this.linkedGroup(lookup.groupId);
      let allBatches = this.allLinkedBatches(lookup._id);
      return (
        <ProductionWrap
          batchData={false}
          itemData={false}
          versionData={false}
          app={app}
        >
          <div>
            <WidgetCard
              groupData={group}
              widgetData={lookup}
              batchRelated={allBatches}
              app={app}
            />
          </div>
          <WikiOps
            wi={lookup.versions[lookup.versions.length - 1].wiki} // newest version
            root={app.instruct}
            anchor={anchor} />
        </ProductionWrap>
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