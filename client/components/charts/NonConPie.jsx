import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

export default class NonConPie extends Component {
  
  splitStatus() {
    const nc = this.props.nonCons;
    let none = 0;
    let fix = 0;
    let done = 0;
    let snooze = 0;
    let skip = 0;
    
    none = nc.filter( n => n.fix === false && n.inspect === false && n.skip === false ).length;
    fix = nc.filter( n => n.fix !== false && n.inspect === false && n.skip === false ).length;
    done = nc.filter( n => n.fix !== false && n.inspect !== false && n.skip === false ).length;
    snooze = nc.filter( n => n.skip !== false && ( n.snooze === true || n.comm === 'sn00ze' ) ).length;
    skip = nc.filter( n => n.inspect === false && n.skip !== false && ( n.snooze === false || n.comm !== 'sn00ze' ) ).length;

    return [
      {'value': none, 'meta': 'To Fix'},
      {'value': fix, 'meta': 'To Inspect'},
      {'value': done, 'meta': 'Resolved'},
      {'value': snooze, 'meta': 'Snoozing'},
      {'value': skip, 'meta': 'Skipped' }
    ];
  }
    
  render () {

    let counts = this.splitStatus();
    
    let ttl = '<span class="centre smCap"><i class="big redT">' + 
                this.props.nonCons.length + 
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