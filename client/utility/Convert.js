import moment from 'moment';

export function min2hr(minutes) {
  return moment.duration(minutes, "minutes")
          .asHours().toFixed(2, 10);
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

// // 1 + 2 + 3 + 4
// console.log(array1.reduce(reducer));
// // expected output: 10

/*
const dArr = entry.durrArray;
const avg = dArr.length == 1 ? dArr[0] : dArr.length > 1 &&
  dArr.reduce( (a,c)=>a+c) / dArr.length;
const avgWeeks = moment.duration(avg, 'minutes').asWeeks();
const avgDays = moment.duration(avg, 'minutes').asDays();

*/