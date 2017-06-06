import React, {Component} from 'react';

// {Pie} from "react-chartjs-2"; //prop-type depreciation problem

//// Requires: no-good nonCons, repaired nonCons, and inspected nonCons \\\\

export default class NCpie extends Component	{

  render () {

    let fix = this.props.fncData;
    let ins = this.props.incData;
    let not = this.props.ncData;

    const chartData = {
      labels: [
        'No Good',
        'Repaired',
        'Inpected'
        ],
      datasets: [{
        data: [not, fix, ins],
        backgroundColor: [
        '#F7464A',
        '#e4f01c',
        '#1bf429'
          ],
        hoverBackgroundColor: [
        '#F7464A',
        '#e4f01c',
        '#1bf429'
          ],
        options: {
        }
      }],

    };


    return (
      <div className='cent'>
        <div className='pieContain'>
          {/*<Pie data={chartData} />*/}
        </div>
      </div>
    );
  }
}