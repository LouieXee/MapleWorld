foo()

async function foo () {
    console.log('1')

    await delay(2000);

    console.log('2')
}

function delay (delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}