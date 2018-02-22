import React, {Component} from 'react';
import Chartist from 'chartist';
import ChartistGraph from 'react-chartist';
import Tooltip from 'chartist-plugin-tooltips';
import moment from 'moment';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';

export default class ProgBurndown extends Component {
  
  constructor() {
    super();
    this.state = {
      counts: false
    };
    //this.labelGenerator = this.labelGenerator.bind(this);  
  }
  
  /*
  labelGenerator() {
    let times = [];
    let now = this.props.live ?
              moment() :
              moment(this.props.lastDay);
    for(let i = 0; i < this.props.dataOne.length; i++) {
      if(this.props.timeRange === 'day' || this.props.timeRange === 'hour') {
        let fqu = now.clone().subtract(i, 'hour');
        times.unshift(fqu.format('h.A'));
      }else if(this.props.timeRange === 'week') {
        let fqu = now.clone().subtract(i, 'day');
        times.unshift(fqu.format('ddd'));
      }else{
        let day = now.clone().subtract(i, 'day');
        times.unshift(day.format('MMM.D'));
      }
    }
    return times;
  }
  */
  
  count() {
    const flowKeys = Array.from( 
                      this.props.flowData.filter( x => x.type !== 'first'), 
                        x => x.key );
    let regItems = this.props.itemData.filter( x => x.alt === false || x.alt === 'no' );
    
    const outScrap = (itms)=> { return ( 
                                  itms.filter( 
                                    x => x.history.filter( 
                                      y => y.type === 'scrap' )
                                        .length === 0 ) ) };
                                        
    regItems = outScrap(regItems);
      
    /*
    const altKeys = Array.from( 
                      this.props.flowAltData.filter( x => x.type !== 'first'), 
                        x => x.key );
    */
    
    const totalSteps = flowKeys.length * regItems.length;
    
    
    let clientTZ = moment.tz.guess();
    let now = moment().tz(clientTZ);
    const current = now.clone().endOf('day');
    const start = moment(this.props.start);
    const howManyDays = current.diff(start, 'day');
    
    function historyPings(regItems, flowKeys, totalSteps, day) {
      let count = 0;

      for(let ky of flowKeys) {
        const ping = regItems.filter( 
                      x => x.history.find( 
                        y => y.key === ky &&
                             y.good === true &&
                             moment(y.time).isSameOrBefore(day) ) );
        count += ping.length;
      }

      const remain = totalSteps - count;
      console.log(remain);
      return remain;
    }
    
    let historyPingsOT = [];
    for(let i = 0; i < howManyDays; i++) {
      const day = start.clone().add(i, 'day');
      
      const historyCount = historyPings(regItems, flowKeys, totalSteps, day);
      historyPingsOT.push(historyCount);
    }
    
    console.log({ howManyDays, totalSteps});
    this.setState({ counts: historyPingsOT });
                    
  }
  
  render () {
    
    const counts = this.state.counts;
    
    if(!counts) {
      return(
        <CalcSpin />
      );
    }
    
    console.log(counts);
    //const maxNum = Math.max(...counts);
    //const labels = this.labelGenerator();
    //const range = this.props.timeRange;
    
    let data = {
      //labels: labels,
      series: [counts]
    };
    
    let options = {
      fullWidth: true,
      height: 300,
      showLabel: false,
      axisY: {
        low: 0,
        //high: maxOne,
        onlyInteger: true,
        divisor: 10,
      },
      axisX: {
        /*
        labelInterpolationFnc: function(value, index) {
          let scale = range === 'year' ? 90 :
                      range === 'month' ? 5 :
                      range === 'week' ? 1 : 7;
          return index % scale === 0 ? 
                 value : 
                 index === labels.length - 1 ? 
                 value :
                 null;
        },
        */
      },
      chartPadding: {
        top: 20,
        right: 45,
        bottom: 0,
        left: -10
      },
      plugins: [
        Chartist.plugins.tooltip({
          appendToBody: true
        }),
      ],
    };
    
    return(
      <span className='rateLines'>
        <div className='wide balance cap'>
          <i className='blueT'>{this.props.title}</i>
        </div>
        <div>
          <ChartistGraph data={data} options={options} type={'Line'} />
        </div>
      </span>
    );
  }
  componentDidMount() {
    this.count();
  }
}