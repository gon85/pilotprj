import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function generate(len: number) {
  let uid = (Math.random() * 0x4000000).toString(36).split('.').join('');
  do {
    uid += (Math.random() * 0x4000000).toString(36).split('.').join('');
    // console.log('----> uid lenght :', uid.length);
  } while (uid.length < len);
  return uid;
}
function padStart(num: number, max: number, fillStr: string) {
  return num.toString().padStart(max, fillStr);
}

export function main() {
  const num = Math.random() * 0x40000000;
  console.log('---->', 0x40000000);
  console.log('----> num :', num);
  console.log('----> num str :', num.toString(16));

  const begin = dayjs();
  const m = new Set();
  for (let index = 0; index < 100000; index++) {
    const g = generate(25);
    if (m.has(g)) {
      console.log('====----> duplication!!!');
    } else {
      m.add(g);
    }
    // console.log('----> uid :', g);
  }
  const end = dayjs();
  const d = dayjs.duration(dayjs().diff(begin));

  console.log(
    '---->',
    `${padStart(d.hours(), 2, '0')}:${padStart(d.minutes(), 2, '0')}:${padStart(d.seconds(), 2, '0')}.${padStart(
      d.milliseconds(),
      3,
      '0',
    )}`,
  );
}

main();
