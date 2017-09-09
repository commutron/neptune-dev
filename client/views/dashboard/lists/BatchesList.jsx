import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class BatchesList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false
    };
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
  }

  render() {
    
    const b = this.props.batchData;
    const f = this.state.filter;
    
    let showList = 
      f === 'done' ?
      b.filter( x => x.finishedAt !== false ) :
      f === 'inproc' ?
      b.filter( x => x.finishedAt === false ) :
      b;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
        
          <FilterActive
            title={b.batch}
            done='Finished'
            total={showList.length}
            onClick={e => this.setFilter(e)} />
            
          { showList.map( (entry, index)=> {
          const style = entry.finishedAt === false ? 'jumpBar gMark' : 'jumpBar';
          const subW = this.props.widgetData.find( x => x._id === entry.widgetId);
          const subV = subW.versions.find( x => x.versionKey === entry.versionKey);
            return (
              <JumpButton
                key={index}
                title={entry.batch} 
                sub={subW.widget + ' v.' + subV.version}
                sty={style}
              />
            )})}
  			</div>
			</AnimateWrap>
    );
  }
}