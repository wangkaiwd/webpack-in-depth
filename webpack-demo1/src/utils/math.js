import _ from 'lodash'
const add = () => {
  console.log('add');
}

const minus = () => {
  console.log('minus');
}
const join = () => {
  const array = _.join('123', '-');
  console.log(array)
}
console.log('math')
export { add, minus, join }