import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class BatchesListWide extends Component	{
  
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

  render() {
    
    const b = this.props.batchData;
    const w = this.props.widgetData;
    const g = this.props.groupData;
    const f = this.state.filter;
    
    let basicFilter = 
      f === 'done' ?
      b.filter( x => x.finishedAt ? x.finishedAt !== false : x.active === false ) :
      f === 'inproc' ?
      b.filter( x => x.finishedAt ? x.finishedAt === false : x.active === true ) :
      b;
    let showList = basicFilter.filter( 
                    tx => tx.batch.toLowerCase().includes(this.state.textString) === true );
    let sortList = showList.sort((b1, b2)=> {
                if (b1.batch < b2.batch) { return 1 }
                if (b1.batch > b2.batch) { return -1 }
                return 0;
              });
    return (
      <AnimateWrap type='cardTrans'>
        <div className='centre space' key={1}>
          <div className='tableList'>
            <div className=''>
              <FilterActive
                title={b.batch}
                open={true}
                done='Finished'
                total={showList.length}
                onClick={e => this.setFilter(e)}
                onTxtChange={e => this.setTextFilter(e)} />
            </div>

            {sortList.map( (entry, index)=> {
              const style = entry.active === true ? 
                            'numFont activeMark' :
                            'numFont gMark';
              const subW = w.find( x => x._id === entry.widgetId);
              const subV = subW.versions.find( x => x.versionKey === entry.versionKey);
              const subG = g.find( x => x._id === subW.groupId);
                return (
                  <LeapRow
                    key={index}
                    title={entry.batch}
                    cTwo={<i><i className='smaller'>so: </i>{entry.salesOrder || 'n/a'}</i>}
                    cThree={subG.alias}
                    cFour={subW.widget + ' v.' + subV.version}
                    sty={style}
                    address={'/data/batch?request=' + entry.batch}
                  />
            )})}
          
          </div>
  			</div>
			</AnimateWrap>
    );
  }
}