type TypeOne = {
  name: string
  age: number
}
interface apiOne extends TypeOne {
  sex: string
}
// 三个属性缺一不可
const obj: apiOne = {
  name: 'name',
  age: 18,
  sex: 'red',
}

type TypeTwo = {
  name: string
  age: number
}
const objTwo: TypeTwo = {
  name: 'name',
  age: 18,
}
