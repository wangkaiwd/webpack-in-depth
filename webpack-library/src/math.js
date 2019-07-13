import _ from 'lodash'
const add = () => {
  const a = _.join([1, 2], '-')
  console.log(a);
}
const minus = () => {
  console.log('minus')
}

export { add, minus }