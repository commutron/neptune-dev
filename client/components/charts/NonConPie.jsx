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
    
    const ncG = this.props.nonCons.filter( n => !n.trash );
    none = ncG.filter( n => n.fix === false && n.inspect === false && n.skip === false ).length;
    fix = ncG.filter( n => n.fix !== false && n.inspect === false && n.skip === false ).length;
    done = ncG.filter( n => n.fix !== false && n.inspect !== false && n.skip === false ).length;
    snooze = ncG.filter( n => n.skip !== false && ( n.snooze === true || n.comm === 'sn00ze' ) ).length;
    skip = ncG.filter( n => n.inspect === false && n.skip !== false && ( n.snooze === false || n.comm !== 'sn00ze' ) ).length;

    return [
      {'value': none, 'meta': 'Awaiting Repair'},
      {'value': fix, 'meta': 'Awaiting Inspection'},
      {'value': done, 'meta': 'Resolved'},
      {'value': snooze, 'meta': 'Snoozing'},
      {'value': skip, 'meta': 'Skipped' }
    ];
  }
    
  render () {
    
    const ncG = this.props.nonCons.filter( n => !n.trash );

    let counts = this.splitStatus();
    
    let ttl = '<span class="centre smCap"><i class="big redT numFont">' + 
                ncG.length + 
                  '</i><i>Total</i></span>';
    
    let data = {
      series: counts,
      labels: Array.from(counts, x => x.meta )
    };
    
    let options = {
      width: 350,
      height: 300,
      showLabel: true,
      labelOffset: 40,
      labelDirection: 'explode',
      ignoreEmptyValues: true,
      chartPadding: 60,
      donut: true,
      donutWidth: 40,
      startAngle: 0,
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