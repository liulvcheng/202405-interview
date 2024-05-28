console.log('start')

setTimeout(() => {
  console.log('setTimeout')
}, 0)

new Promise((resolve, reject) => {
  console.log('promise')
  resolve()
})
  .then(function () {
    console.log('promise1')
  })
  .then(function () {
    console.log('promise2')
  })

console.log('end')
