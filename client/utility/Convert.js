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