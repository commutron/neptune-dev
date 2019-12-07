import React, {Component} from 'react';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
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
    return activeList;
  }

  render() {
    
    const g = this.props.groupData;
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

    return(
      <div className='section sidebar' key={1}>
      
        <FilterActive
          title={g.alias}
          done='Inactive'
          total={showList.length}
          onClick={e => this.setFilter(e)}
          onTxtChange={e => this.setTextFilter(e)} />
          
        { sortList.map( (entry)=> {
          let ac = a.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
          return (
            <JumpButton
              key={entry._id}
              title={entry.alias}
              sub=''
              sty={ac}
            />
          )})}
			</div>
    );
  }
}