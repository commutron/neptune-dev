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
    return [
      {'value': none, 'meta': 'Pending'},
      {'value': fix, 'meta': 'Fix'},
      {'value': done, 'meta': 'Done'},
      {'value': snooze, 'meta': 'Snooze'},
      {'value': skip, 'meta': 'Skip' }
    ];
  }
    
  render () {

    let counts = this.splitStatus();
    
    let ttl = '<span class="centre smCap"><i class="big redT">' + 
                this.props.nonCons.length + 
                  '</i><i>Total</i></span>';
    
    let data = {
      labels: ['Pending', 'Fixed', 'Inspected', 'Snoozed', 'Skipped'],
      series: counts,
    };
    
    let options = {
      width: 300,
      height: 300,
      showLabel: true,
      labelOffset: 40,
      labelDirection: 'explode',
      ignoreEmptyValues: true,
      chartPadding: 60,
      donut: true,
      donutWidth: 40,
      startAngle: 0,
      //total: this.props.nonCons.length,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
        Chartist.plugins.fillDonut({
          items: [{
            content: ttl,
            position: 'center',
            offsetY : -4,
            offsetX: 0
          }],
        }),
      ]
    };

    return (
      <div className='nonConPieColors centre middle'>
        <ChartistGraph data={data} options={options} type={'Pie'} />
      </div>
    );
  }
}