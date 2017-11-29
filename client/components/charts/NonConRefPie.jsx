import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';
import Pref from '/client/global/pref.js';

export default class NonConPie extends Component {
  
  ncCounts() {
    const refs = Array.from(this.props.nonCons, x => x.ref);
    
    const uniqueRefs = new Set(refs);
    
    let refCounts = [];
    uniqueRefs.forEach( x => {
      let qu = refs.filter( y => y === x );
      refCounts.push({
        'value': qu.length,
        'meta': x
      });
    });
    return {
      'uniques': uniqueRefs.size,
      'counts': refCounts
    };
  }
    
  render () {

    let ncData = this.ncCounts();
    
    let ttl = '<span class="centre smCap"><i class="big redT">' + 
                ncData.uniques + 
                  '</i><i>References</i></span>';
    
    let data = {
      labels: false,
      series: ncData.counts,
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
          appendToBody: true,
          class: 'up'
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
      <div className='inlineContain'>
        <p className='centreText'>
          <i className='cap'>{Pref.item} locations</i>
        </p>
        <div className='centre'>
          <ChartistGraph data={data} options={options} type={'Pie'} />
        </div>
      </div>
    );
  }
}