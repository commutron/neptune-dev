import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import LeapRow from '/client/components/tinyUi/LeapRow.jsx';
import DumbFilter from '/client/components/tinyUi/DumbFilter.jsx';

export default class BatchesListWide extends Component	{
  
  constructor() {
    super();
    this.state = {
      textString: ''
    };
  }

  setTextFilter(rule) {
    this.setState({ textString: rule.toLowerCase() });
  }

  render() {
    
    const w = this.props.widgetData;
    const g = this.props.groupData;
    
    let blendedList = [];
    for(let b of this.props.batchData){
      const style = b.active === true ? 'numFont activeMark' : 'numFont gMark';
      const subW = w.find( x => x._id === b.widgetId);
      const subV = subW.versions.find( x => x.versionKey === b.versionKey);
      const subG = g.find( x => x._id === subW.groupId);
      blendedList.push({
        batchNumber: b.batch,
        salesNumber: b.salesOrder || 'n/a',
        groupAlias: subG.alias,
        widget: subW.widget, 
        version: subV.version,
        highlight: style
      });
    }
    
    let showList = blendedList.filter( 
                    tx => 
                      tx.batchNumber.toLowerCase().includes(this.state.textString) === true ||
                      tx.salesNumber.toLowerCase().includes(this.state.textString) === true ||
                      tx.groupAlias.toLowerCase().includes(this.state.textString) === true ||
                      tx.widget.toLowerCase().includes(this.state.textString) === true ||
                      tx.version.toLowerCase().includes(this.state.textString) === true
                  );
    let sortList = showList.sort((b1, b2)=> {
                if (b1.batchNumber < b2.batchNumber) { return 1 }
                if (b1.batchNumber > b2.batchNumber) { return -1 }
                return 0;
              });
    return(
      <AnimateWrap type='cardTrans'>
        <div className='centre space' key={1}>
          <div className='tableList'>
            <div className=''>
              <DumbFilter
                size='big'
                onTxtChange={e => this.setTextFilter(e)} />
            </div>

            {sortList.map( (entry, index)=> {
                return (
                  <LeapRow
                    key={index}
                    title={entry.batchNumber}
                    cTwo={<i><i className='smaller'>so: </i>{entry.salesNumber}</i>}
                    cThree={entry.groupAlias}
                    cFour={entry.widget + ' v.' + entry.version}
                    sty={entry.highlight}
                    address={'/data/batch?request=' + entry.batchNumber}
                  />
            )})}
          
          </div>
  			</div>
			</AnimateWrap>
    );
  }
}