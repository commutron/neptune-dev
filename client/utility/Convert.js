import moment from 'moment';

export function min2hr(minutes) {
  const asHours = moment.duration(minutes, "minutes").asHours();
  const trunc = ( Math.round(
                   (asHours + Number.EPSILON) * 100) 
                      / 100 ).toFixed(2, 10);
  return trunc;
}

export function round1Decimal(thrtytw) {
  const trunc = Math.round((thrtytw + Number.EPSILON) * 10) / 10;
  // exactly rounding to 1 decimal points
  return trunc;
}

export function round2Decimal(thrtytw) {
  const trunc = Math.round((thrtytw + Number.EPSILON) * 100) / 100;
  // exactly rounding to 2 decimal points
  return trunc;
}

export function avgOfArray(arr, zeros) {
  const cArr = zeros ? arr.filter( f => ( f || f === 0 ) && !isNaN(f) ) :
                       arr.filter( f => f && !isNaN(f) );
  
  if(cArr.length == 1) {
    return cArr[0];
  }else if(cArr.length > 1) {
    const reduced = cArr.reduce( (a,c)=>a+c) / cArr.length;
    return reduced;
  }else{
    return 0;
  }
}

export function flipArray(originalArr) {
  const flippedArr = originalArr.reduce((ary, ele) => 
                      {ary.unshift(ele); return ary}, []);
  return flippedArr;
}

export function percentOf(goalNumber, realNumber) {
  const perOf = ( realNumber / goalNumber ) * 100;
  const perOfClean = isNaN(perOf) ? 0 : round2Decimal(perOf);
  return perOfClean;
}

export function percentOverUnder(goalNumber, realNumber) {
  const overunder = ( 1 - ( realNumber / goalNumber ) ) * 100;
  const overunderClean = isNaN(overunder) ? 0 : round2Decimal(overunder);
  return overunderClean;
}


// milliseconds

export function ms2sc(milliseconds) {
  const asSeconds = moment.duration(milliseconds).asSeconds();
  const trunc = ( Math.round(
                   (asSeconds + Number.EPSILON) * 100) 
                      / 100 ).toFixed(2, 10);
  return parseFloat(trunc);
}   
export function ms2mn(milliseconds) {
  const asMinutes = moment.duration(milliseconds).asMinutes();
  const trunc = ( Math.round(
                   (asMinutes + Number.EPSILON) * 100) 
                      / 100 ).toFixed(2, 10);
  return parseFloat(trunc);
}
export function sc2hr(milliseconds) {
  const asHours = moment.duration(milliseconds).asHours();
  const trunc = ( Math.round(
                   (asHours + Number.EPSILON) * 100) 
                      / 100 ).toFixed(2, 10);
  return parseFloat(trunc);
}

export function chunkArray(input, size) {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]];
  }, []);
} // https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore