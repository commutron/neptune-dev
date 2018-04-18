import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import LeapButton from '/client/components/tinyUi/LeapButton.jsx';
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
    const w = this.props.widgetData
                .sort((w1, w2)=> {
                  if (w1.widget < w2.widget) { return -1 }
                  if (w1.widget > w2.widget) { return 1 }
                  return 0;
                });
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
      </AnimateWrap>
    );
  }
}