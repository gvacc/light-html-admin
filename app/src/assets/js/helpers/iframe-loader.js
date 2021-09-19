HTMLIFrameElement.prototype.load = function(url, callback) {
	const iframe = this

	try {
		iframe.src = url + '?rnd=' + Math.random().toString().substring(2)
	} catch(e) {
		if(!callback) {
			return new Promise((resolve, reject) => {
				reject(e)
			})
		} else {
			callback(e)
		}
	}

	const maxTime = 30000
	const interval = 200

	let timerCount = 0

	if(!callback) {
		return new Promise((resolve, reject) => {
			const timer = setInterval(() => {
				if(!iframe) return clearInterval(timer)
				timerCount++
				if(iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
					clearInterval(timer)
					resolve()
				} else if(timerCount * interval > maxTime) {
					reject(new Error('Iframe load fail!'))
				}
                
			}, interval)
		})
	} else {
		const timer = setInterval(() => {
			if(!iframe) return clearInterval(timer)
			timerCount++
			if(iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
				clearInterval(timer)
				callback()
			} else if(timerCount * interval > maxTime) {
				callback(new Error('Iframe load fail!'))
			}
			
		}, interval)
	}
}