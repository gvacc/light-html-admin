(async() => {
    const response = await fetch('/laboratory/app/dist/api')
    const data = await response.json()
    console.log(data)
})()