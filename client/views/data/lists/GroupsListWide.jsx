import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';

export default class GroupsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      textString: ''
    };
  }
  
  setTextFilter(rule) {
    this.setState({ textString: rule.toLowerCase() });
  }
  
  groupActive() {
    let activeBatch = this.props.batchData.filter( x => x.live === true);
    
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
    const xBatches = this.props.batchDataX.filter( x => x.live === true);
    for(let x of xBatches) { activeList.push(x.groupsId) }
    
    return activeList;
  }

  render() {
    
    const a = this.groupActive();
    
    let showList = this.props.groupData.filter( 
      tx => tx.group.toLowerCase().includes(this.state.textString) === true ||
            tx.alias.toLowerCase().includes(this.state.textString) === true);
    
    let sortList = showList.sort((g1, g2)=> {
                    if (g1.alias < g2.alias) { return -1 }
                    if (g1.alias > g2.alias) { return 1 }
                    return 0;
                  });
                  
    return (
      <AnimateWrap type='cardTrans'>
        <div className='centre space' key={1}>
          <div className='tableList'>
          
            <div className=''>
              <DumbFilter
                size='bigger'
                onTxtChange={e => this.setTextFilter(e)}
                labelText='Filter by any text, not case-sensitve.' />
            </div>  
          
            {sortList.map( (entry, index)=> {
              let ac = a.includes(entry._id) ? 'activeMark' : '';
              return (
                <LeapRow
                  key={index}
                  title={entry.alias.toUpperCase()}
                  cTwo={<i className='cap'>{entry.group}</i>}
                  cThree={false}
                  cFour={false}
                  cFive={false}
                  sty={ac}
                  address={'/data/group?request=' + entry.alias}
                />
              )})}
          </div>
  			</div>
			</AnimateWrap>
    );
  }
}