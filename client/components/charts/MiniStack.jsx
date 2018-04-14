import React from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';

const MiniStack = ({ title, count, countNew, total })=> {
  
  let v = count;
  let vX = countNew;
  let t = total;
  
  let name = {
    position: 'relative',
    top: '0.75rem',
  };
  let bar = {
    width: '100%'
  };
  let num = {
    textAlign: 'right'
  };
  return(
    <div className='wide'>
      <p style={name} className='cap'>{title}</p>
      <progress style={bar} className='proGood' value={v} max={t}></progress>
      <p style={num}>{vX} + {v - vX}/{t}</p>
    </div>
  );
};

export default MiniStack;

/*

export class NonConTypeChart extends Component {

  render () {

    const counts = this.props.counts;
    
    let data = {
      labels: this.props.ncOp,
      series: counts,
    };
    
    let options = {
      height: 800,
      fullWidth: true,
      horizontalBars: true,
      stretch: false,
      stackBars: true,
      axisX: {
        low: 0,
        onlyInteger: true,
        position: 'start'
      },
      axisY: {
        offset: 100
      },
      chartPadding: {
        top: 10,
        right: 25,
        bottom: 20,
        left: 25
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true,
          class: 'cap'
        })
      ]
    };

    return (
      <div>
        <br />
        <ChartistGraph data={data} options={options} type={'Bar'} />
      </div>
    );
  }
}

*/