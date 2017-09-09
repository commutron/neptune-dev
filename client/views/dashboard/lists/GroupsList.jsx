import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class GroupsList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
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
    
    let showList = 
      f === 'done' ?
      g.filter( x => a.includes(x._id) === false ) :
      f === 'inproc' ?
      g.filter( x => a.includes(x._id) !== false ) :
      g;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
        
          <FilterActive
            title={g.alias}
            done='Inactive'
            total={showList.length}
            onClick={e => this.setFilter(e)} />
            
          { showList.map( (entry, index)=> {
            let ac = a.includes(entry._id) ? 'jumpBar gMark' : 'jumpBar';
            return (
              <JumpButton
                key={index}
                title={entry.group}
                sub=''
                sty={ac}
              />
            )})}
  			</div>
			</AnimateWrap>
    );
  }
}