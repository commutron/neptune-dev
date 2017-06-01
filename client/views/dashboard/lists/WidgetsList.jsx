import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';

import JumpFind from '../../../components/smallUi/JumpFind.jsx';

export default class WidgetsList extends Component	{

  render() {

    const a = this.props.active;
    const w = this.props.widgetData.sort((w1, w2) => {return w1.widget > w2.widget});

    return (
      <SlideDownWrap>
        <div className='card'>
          { w.map( (entry, index)=> {
          let ac = a.includes(entry.widget) ? 'action clear wide greenT' : 'action clear wide';
            return (
              <JumpFind key={index} title={entry.widget} sub={' - ' + entry.describe} sty={ac} />
            )})}
        </div>
      </SlideDownWrap>
    );
  }
}