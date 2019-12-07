import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import LeapButton from '../../../components/tinyUi/LeapButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class WidgetsList extends Component	{
  
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

    const a = this.props.active;
    const w = this.props.widgetData.sort((w1, w2) => {return w1.widget > w2.widget});
    const g = this.props.groupAlias;
    const f = this.state.filter;
    
    let basicFilter = 
      f === 'done' ?
      w.filter( x => a.includes(x._id) === false ) :
      f === 'inproc' ?
      w.filter( x => a.includes(x._id) !== false ) :
      w;
    let showList = basicFilter.filter( 
      tx => tx.widget.toLowerCase().includes(this.state.textString) === true ||
            tx.describe.toLowerCase().includes(this.state.textString) === true);

    return(
      <div className='section sidebar' key={1}>
      
        <FilterActive
          title={g.alias}
          done='Inactive'
          total={showList.length}
          onClick={e => this.setFilter(e)}
          onTxtChange={e => this.setTextFilter(e)} />
          
        {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
          { showList.map( (entry, index)=> {
          let ac = a.includes(entry._id) ? 'leapBar activeMark' : 'leapBar';
            return (
              <LeapButton
                key={index}
                title={entry.widget}
                sub={entry.describe}
                sty={ac}
                address={'/data/widget?request=' + entry.widget}
              />
          )})}
      </div>
    );
  }
}