import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import FilterActive from '../../../components/bigUi/FilterActive.jsx';

export default class WidgetsList extends Component	{
  
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

    const a = this.props.active;
    const w = this.props.widgetData.sort((w1, w2) => {return w1.widget > w2.widget});
    const g = this.props.groupAlias;
    const f = this.state.filter;
    
    let showList = 
      f === 'done' ?
      w.filter( x => a.includes(x._id) === false ) :
      f === 'inproc' ?
      w.filter( x => a.includes(x._id) !== false ) :
      w;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
        
          <FilterActive
            title={g.alias}
            done='Inactive'
            total={showList.length}
            onClick={e => this.setFilter(e)} />
            
          {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
            { showList.map( (entry, index)=> {
            let ac = a.includes(entry._id) ? 'jumpBar activeMark' : 'jumpBar';
            let inStyl = entry.widget === Session.get('now');
              return (
                <JumpButton
                  key={index}
                  title={entry.widget}
                  sub={entry.describe}
                  sty={ac}
                  inStyle={inStyl}
                />
            )})}
        </div>
      </AnimateWrap>
    );
  }
}