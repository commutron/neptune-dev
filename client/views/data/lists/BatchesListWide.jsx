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
        tags: b.tags,
        highlight: style
      });
    }
    
    const query = this.state.textString.toLowerCase();
    
    let showList = blendedList.filter( 
                    tx => 
                      tx.batchNumber.toLowerCase().includes(query) === true ||
                      tx.salesNumber.toLowerCase().includes(query) === true ||
                      tx.groupAlias.toLowerCase().includes(query) === true ||
                      tx.widget.toLowerCase().includes(query) === true ||
                      tx.version.toLowerCase().includes(query) === true ||
                      tx.tags.join('|').toLowerCase().split('|').includes(query) === true
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
                id='batchOverview'
                size='big'
                onTxtChange={e => this.setTextFilter(e)}
                labelText='Filter searches all columns, not case-sensitve.'
                list={this.props.app.tagOption} />
            </div>

            {sortList.map( (entry, index)=> {
              const tags = entry.tags.map( (et, ix)=>{
                return(<span key={ix} className='tagFlag'><i>{et}</i></span>)});
                return (
                  <LeapRow
                    key={index}
                    title={entry.batchNumber.toUpperCase()}
                    cTwo={<i><i className='smaller'>so: </i>{entry.salesNumber.toUpperCase()}</i>}
                    cThree={entry.groupAlias.toUpperCase()}
                    cFour={entry.widget.toUpperCase() + ' v.' + entry.version}
                    cFive={tags}
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