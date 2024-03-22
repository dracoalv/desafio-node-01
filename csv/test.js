async function * test(name) {
  let i = 0
  for (;;) {
    yield `${name} ${i++}`
    // await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

async function generatorTest(name) {
  for await (const id of test(name)) {
    console.log(id)
  }
}

generatorTest('zolo3k')
generatorTest('marcelo3k')

for await (const id of test('matheus3k')) {
  console.log(id)
}