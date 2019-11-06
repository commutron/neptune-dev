import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class GroupsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false,
      textString: ''
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
  }
  setTextFilter(rule) {
    this.setState({ textString: rule.toLowerCase() });
  }
  
  groupActive() {
    let activeBatch = this.props.batchData.filter( x => x.active === true);
    
    let activeList = [];
    
    for(let grp of this.props.groupData) {
      let widgetsList = this.props.widgetData.filter(x => x.groupId === grp._id);
      
      for(let wdgt of widgetsList) {
        let match = activeBatch.find(x => x.widgetId === wdgt._id);
        if(match) {
          activeList.push(grp._id);
          break;
        }else{
          null;
        }
      }
    }
    const xBatches = this.props.batchDataX.filter( x => x.active === true);
    for(let x of xBatches) { activeList.push(x.groupsId) }
    
    return activeList;
  }

  render() {
    
    const g = this.props.groupData.sort((g1, g2)=> {
                    if (g1.group < g2.group) { return -1 }
                    if (g1.group > g2.group) { return 1 }
                    return 0;
                  });
    const a = this.groupActive();
    const f = this.state.filter;
    
    let basicFilter = 
      f === 'done' ?
      g.filter( x => a.includes(x._id) === false ) :
      f === 'inproc' ?
      g.filter( x => a.includes(x._id) !== false ) :
      g;
    let showList = basicFilter.filter( 
      tx => tx.group.toLowerCase().includes(this.state.textString) === true ||
            tx.alias.toLowerCase().includes(this.state.textString) === true);
    
    let sortList = showList.sort((g1, g2)=> {
                    if (g1.alias < g2.alias) { return -1 }
                    if (g1.alias > g2.alias) { return 1 }
                    return 0;
                  });
                  
    return (
      <AnimateWrap type='cardTrans'>
        <div className='' key={1}>
          <div className='stickyBar'>
            <FilterActive
              title={g.alias}
              done='Inactive'
              total={showList.length}
              onClick={e => this.setFilter(e)}
              onTxtChange={e => this.setTextFilter(e)} />
          </div>  
          { sortList.map( (entry, index)=> {
            let ac = a.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
            return (
              <LeapButton
                key={index}
                title={entry.group}
                sub=''
                sty={ac}
                address={'/data/overview?request=groups&specify=' + entry.alias}
              />
            )})}
  			</div>
			</AnimateWrap>
    );
  }
}