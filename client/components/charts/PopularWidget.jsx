import React, {Component} from 'react';
import Pref from '/client/global/pref.js';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

export default class NonConRate extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false,
      groups: false
    };
  }
  
  counts() {
    Meteor.call('popularWidgets', (error, reply)=>{
      if(error)
        console.log(error);
      if(reply) {
        this.setState({ counts: reply });
        let groupSet = [];
        for(let g of this.props.groupData) {
          const num = reply.filter( x => x.group === g._id ).length;
          groupSet.push({meta: g.alias, value: num});
        }
        let groupSetOrder = groupSet.sort((a, b)=> { return b.value - a.value });
        this.setState({ groups: groupSetOrder });
      }
    });
  }
  
  render () {
    
    const counts = this.state.counts;
    const groups = this.state.groups;
    
    if(!counts || !groups) {
      return(
        <CalcSpin />
      );
    }
    
    const countLine = Array.from(counts, x => x.value).reduce((x,y)=> x + y) / counts.length;
    const groupLine = Array.from(groups, x => x.value).reduce((x,y)=> x + y) / groups.length;
    
    let medianTry = counts[Math.floor(counts.length / 2)];
    let median = !medianTry ? countLine : medianTry.value;
  
    let dataOne = {
      series: counts,
      labels: Array.from(counts, 
                x => { 
                  let name = x.value > median ? x.meta.toUpperCase() : ' '; 
                  return name })
    };

    let dataTwo = {
      series: groups,
      labels: Array.from(groups,
                x => { 
                  let name = x.value > ( groupLine % 2 ) ? x.meta.toUpperCase() : ' ';
                  return name })
    };
    
    let options = {
      width: 500,
      height: 400,
      showLabel: true,
      labelOffset: 75,
      labelDirection: 'explode',
      ignoreEmptyValues: true,
      chartPadding: 75,
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true,
          class: 'up'
        }),
      ]
    };
    
    return(
      <div>
        <p className='centreText cap'>popular by quantity of {Pref.batch}s</p>
        <div className='wide centreRow cap'>
          <div className='centre'>
            <i>{Pref.group}s</i>
            <ChartistGraph data={dataTwo} options={options} type={'Pie'} />
          </div>
          <div className='centre'>
            <i>{Pref.widget}s</i>
            <ChartistGraph data={dataOne} options={options} type={'Pie'} />
          </div>        
        </div>
      </div>
    );
  }
  componentDidMount() {
    this.counts();
  }
}