import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import fillDonut from 'chartist-plugin-fill-donut';

export default class NonConTypePie extends Component {

  render () {

    const counts = this.props.counts;
                  
    let cntr = '<span class="centre smCap"><i class="big redT">' + 
                  this.props.total + 
                    '</i><i>Total</i></span>';
    
    let mergedSeries = [];
    counts.forEach( (x, index) => 
                      mergedSeries.push({
                        'value': x,
                        'meta': this.props.ncOp[index]
                      }) );

    let data = {
      labels: this.props.ncOp,
      series: mergedSeries,
    };
    
    let options = {
      width: 300,
      height: 300,
      donut: true,
      donutWidth: 60,
      startAngle: 0,
      showLabel: false,
      chartPadding: 25,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
        Chartist.plugins.fillDonut({
          items: [{
            content: cntr,
            position: 'center',
            offsetY : -4,
            offsetX: 0
          }],
        }),
      ]
    };

    return (
      <div className='centre'>
        <i className='redT cap'>{this.props.title}</i>
        <ChartistGraph data={data} options={options} type={'Pie'} />
      </div>
    );
  }
}