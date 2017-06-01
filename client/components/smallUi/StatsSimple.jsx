import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import StatBox from './StatBox.jsx';

// requires report

export default class StatsSimple extends Component	{

  render() {

    const r = this.props.report;

    return (
      <div>
        <StatBox title='Total NonCons' num={r.ncTotal} />
        <StatBox title={Pref.material + ' NonCons'} num={r.ncMaterial} />
        <StatBox title={Pref.partTool + ' NonCons'} num={r.ncPart} />
        <StatBox title={Pref.joinTool + ' NonCons'} num={r.ncJoin} />
        <StatBox title={'Returned ' + Pref.item + 's'} num={r.returns} />
        <StatBox title={'Scrapped ' + Pref.item + 's'} num={r.scraps} />
        <StatBox title={Pref.missingPart + 's'}  num={r.shorts} />
      </div>
    );
  }
}