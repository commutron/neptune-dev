import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class WidgetsList extends Component	{

  render() {

    const a = this.props.active;
    const w = this.props.widgetData.sort((w1, w2) => {return w1.widget > w2.widget});

    return (
      <SlideDownWrap>
        <div className='card centre'>
        {this.props.listTitle ? <h2 className='up'>{this.props.groupAlias}</h2> : null}
        {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
          { w.map( (entry, index)=> {
          let ac = a.includes(entry.widget) ? 'action clear wide greenT' : 'action clear wide';
            return (
              <JumpButton key={index} title={entry.widget} sub={' - ' + entry.describe} sty={ac} />
            )})}
        </div>
      </SlideDownWrap>
    );
  }
}