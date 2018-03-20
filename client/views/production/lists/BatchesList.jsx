import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class BatchesList extends Component	{
  
  constructor() {
    super();
    this.state = {
      filter: false,
      versionNames: false
    };
    this.getVersions = this.getVersions.bind(this);
  }
  
  setFilter(rule) {
    this.setState({ filter: rule });
  }
  
  // what the what
  getVersions() {
    let vFetch = [];
    for(let b of this.props.batchData) {
      Meteor.call('quickVersion', b.versionKey, (error, reply)=>{
        if(error)
          console.log(error);
        if(reply) {
          vFetch.push({vKey: b.versionKey, vName: reply});
        }else{null}
      });
    }
    this.setState({ versionNames : vFetch });
  }

  render() {
    
    const b = this.props.batchData;
    const w = this.props.widgetData;
    const f = this.state.filter;
    const v = this.state.versionNames;
    
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
            
          {showList.map( (entry, index)=> {
            const style = entry.finishedAt === false ? 
                          'leapBar activeMark' : 
                          'leapBar gMark';
            const subW = w.find( x => x._id === entry.widgetId);
            const subV = !v ? false : v.find( x => x.vKey === entry.versionKey);
            const subVname = !subV ? false : subV.vName;
              return (
                <JumpButton
                  key={index}
                  title={entry.batch} 
                  sub={<i><i className='up'>{subW.widget}</i> v.{subVname}</i>}
                  sty={style}
                />
          )})}
  			</div>
			</AnimateWrap>
    );
  }
  componentDidMount() {
    this.getVersions();
  }
}