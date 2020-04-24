import moment from 'moment';

export function min2hr(minutes) {
  return moment.duration(minutes, "minutes")
          .asHours().toFixed(2, 10);
}