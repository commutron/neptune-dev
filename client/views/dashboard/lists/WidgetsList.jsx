import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';
import JumpText from '../../../components/tinyUi/JumpText.jsx';

export default class WidgetsList extends Component	{

  render() {

    const a = this.props.active;
    const w = this.props.widgetData.sort((w1, w2) => {return w1.widget > w2.widget});
    const g = this.props.groupAlias;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
        {w.length < 1 ? <p>no {Pref.widget}s created</p> : null}
          { w.map( (entry, index)=> {
          let ac = a.includes(entry._id) ? 'jumpBar gMark' : 'jumpBar';
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