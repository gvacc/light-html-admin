import React, {Component} from 'react'
import axios from 'axios'
import '../../helpers/iframe-loader.js'

const validate_file_name = (() => {
	const rg1=/^[^\\/:\*\?"<>\|]+$/  // eslint-disable-line
	const rg2=/^\./ 
	const rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i 
	const rg4 = /^\s/

	return (candidate) => {
		const is_valid = rg1.test(candidate)
                            &&!rg2.test(candidate)
                            &&!rg3.test(candidate)
                            &&!rg4.test(candidate)
		if(is_valid) {
			return candidate
				.replace(/(\.[^/.]+$)/, '')
				.replace(/\s/g, '')
				.toLowerCase()
		} 
		return false
	}
})()

export default class Editor extends Component {
	constructor() {
		super()
		this.currentPage = 'index.html'
		this.state = {
			pageList: [],
			newPageName: '' //TODO: Поменять на file_name
		}

		this.createNewPage = this.createNewPage.bind(this)
	}

	componentDidMount() {
		this.init(this.currentPage)
	}

	init(page) {
		this.iframe = document.querySelector('iframe')
		this.open(page)
		this.loadPageList()
	}

	open(page) {
		this.currentPage = page

		axios.get(`../../../../${page}` + '?rnd=' + Math.random().toString().substring(2))
			.then(({data}) => this.parseStrToDOM(data))
			.then(this.wrapTextNodes)
			.then(dom => {
				this.virtualDom = dom
				return dom
			})
			.then(this.serializeDOMToString)
			.then(html => axios.post('/admin/app/dist/api/save-temp-page.php', {html}))
			.then(({data}) => this.iframe.load(`../../../../${data.file_name}`))
			.then(() => this.enableEditing())
	}

	save() {
		const newDom = this.virtualDom.cloneNode(this.virtualDom)
		this.unwrapTextNodes(newDom)
		const html = this.serializeDOMToString(newDom)
		axios.post('/admin/app/dist/api/save-page.php', {pageName: this.currentPage, html})
	}

	enableEditing() {
		this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
			element.contentEditable = 'true'
			element.addEventListener('input', () => {
				this.onTextEdit(element)
			})
		})
	}

	onTextEdit(element) {
		const id = element.getAttribute('nodeid')
		this.virtualDom.body.querySelector(`[nodeid="${id}"]`).innerHTML = element.innerHTML
	}

	parseStrToDOM(str) {
		const parser = new DOMParser()
		return parser.parseFromString(str, 'text/html')
	}

	serializeDOMToString(dom) {
		const serializer = new XMLSerializer()
		return serializer.serializeToString(dom)
	}

	unwrapTextNodes(dom) {
		dom.body.querySelectorAll('text-editor').forEach(element => {
			element.parentNode.replaceChild(element.firstChild, element)
		})
	}

	wrapTextNodes(dom) {
		const body = dom.body
		let textNodes = []

		function findTextElements(element) {
			element.childNodes.forEach(node => {
				if(node.nodeName === '#text' && node.nodeValue.replace(/\s+/g, '').length > 0) {
					textNodes.push(node)
				} else {
					findTextElements(node)
				}
			})
		}

		findTextElements(body)
		textNodes.forEach((node, i) => {
			const wrapper = dom.createElement('text-editor')
			node.parentNode.replaceChild(wrapper, node)
			wrapper.appendChild(node)
			wrapper.setAttribute('nodeid', i)
		})

		return dom
	}

	async loadPageList() {
		try {
			const {data} = await axios.get('/admin/app/dist/api/')
			this.setState({pageList: data})
		} catch(e){
			alert(e.response.data.message)
		}
	}

	async deletePage(file_name) {
		try {
			const {data} = await axios.post('/admin/app/dist/api/delete-page.php', {file_name})
			const pageList = this.state.pageList.filter(page => page !== data.file_name)
			this.setState({pageList})
		} catch(e) {
			alert(e.response.data.message)
		}
	}

	async createNewPage() {
		try {
			const file_name = this.state.newPageName
			const is_valid_name = validate_file_name(file_name)

			if(!is_valid_name) {
				alert('Некорректное название файла!')
				return
			}
			const {data} = await axios.post('/admin/app/dist/api/create-page.php', {file_name})
			this.setState({pageList: [data.file_name, ...this.state.pageList,]})

		} catch(e){
			alert(e.response.data.message)
		}
        
	}

	render() {
		// const {pageList} = this.state
		// const pages = pageList.map((page, idx) => {
		//     return (
		//         <h1 key={idx}>
		//             {page}
		//             <a 
		//                 href="#"
		//                 onClick={() => this.deletePage(page)}
		//                 className="delete"
		//             >
		//                 Удалить
		//             </a>
		//         </h1>
		//     )
		// })
		return (
		// <>
		//     <input 
		//         type='text' 
		//         onChange={(e) => this.setState({newPageName: e.target.value})} 
		//         type="text"
		//     />
		//     <button onClick={this.createNewPage}>Создать файл</button>
		//     {pages}
		// </>
			<>
				<button onClick={() => this.save()}>click</button>
				<iframe src={this.currentPage} frameBorder="0"></iframe>
			</>
			
		)
	}
}