import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

export default class NonConPie extends Component {
  
  splitStatus() {
    let none = 0;
    let fix = 0;
    let done = 0;
    let snooze = 0;
    let skip = 0;
    
    for( let n of this.props.nonCons) {
      n.fix === false && n.inspect === false && n.skip === false ? none += 1 : false;
      n.fix !== false && n.inspect === false && n.skip === false ? fix += 1 : false;
      n.fix !== false && n.inspect !== false && n.skip === false ? done += 1 : false;
      n.skip !== false && n.comm === 'sn00ze' ? snooze += 1 : false;
      n.inspect === false && n.skip !== false && n.comm !== 'sn00ze' ? skip += 1 : false;
    }
    return [ none, fix, done, snooze, skip ];
  }
    
  render () {

    let counts = this.splitStatus();
    
    let ttl = '<span class="centre"><i>Total</i><i class="big">' + this.props.nonCons.length + '</i></span>';
    
    let data = {
      labels: ['Pending', 'Fixed', 'Inspected', 'Snoozed', 'Skipped'],
      series: counts,
    };
    
    let options = {
      width: 300,
      height: 300,
      showLabel: false,
      chartPadding: 25,
      donut: true,
      donutWidth: 60,
      startAngle: 0,
      total: this.props.nonCons.length,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
        Chartist.plugins.fillDonut({
          items: [{
            content: ttl,
            position: 'center',
            offsetY : -3,
            offsetX: 0
          }],
        }),
      ]
    };
    
    let pnd = { color: '#e74c3c' };
    let fxd = { color: '#e67e22' };
    let inp = { color: '#2ecc71'};
    let snz = { color: '#f39c12'};
    let skp = { color: '#f1c40f'};

    return (
      <div className='inlineContain nonConPieColors'>
        <p className='centreText'>
          <i style={pnd}>Pending </i>
          <i style={fxd}> Fixed </i>
          <i style={inp}> Inspected </i>
          <i style={snz}> Snoozed </i>
          <i style={skp}> Skipped </i>
        </p>
        <div className='centre'>
          <ChartistGraph data={data} options={options} type={'Pie'} />
        </div>
      </div>
    );
  }
}