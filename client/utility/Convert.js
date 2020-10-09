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


// const array1 = [1, 2, 3, 4];
// const reducer = (accumulator, currentValue) => accumulator + currentValue;

// console.log(array1.reduce(reducer));
// // expected output: 10

export function avgOfArray(arr) {
  const cArr = arr.filter( f => f );
  
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
