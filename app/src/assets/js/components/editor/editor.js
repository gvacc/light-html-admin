import React, {Component} from 'react'
import axios from 'axios'
import '../../helpers/iframe-loader.js'
import DOMHelper from '../../helpers/dom-helper.js'
import EditorText from '../editor-text/editor-text.js'
import UIkit from 'uikit'
import ModalPortal from '../ui/modalPortalSave/modal.js'
import Spinner from '../ui/spinner/spinner.js'

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
			newPageName: '', //TODO: Поменять на file_name,
			loading: true
		}

		this.createNewPage = this.createNewPage.bind(this)
		this.isLoading = this.isLoading.bind(this)
		this.isLoaded = this.isLoaded.bind(this)
	}

	componentDidMount() {
		this.init(this.currentPage)
	}

	init(page) {
		this.iframe = document.querySelector('iframe')
		this.open(page, this.isLoaded)
		this.loadPageList()
	}

	open(page, cb) {
		this.currentPage = page

		axios.get(`../../../../${page}` + '?rnd=' + Math.random().toString().substring(2))
			.then(({data}) => DOMHelper.parseStrToDOM(data))
			.then(DOMHelper.wrapTextNodes)
			.then(dom => {
				this.virtualDom = dom
				return dom
			})
			.then(DOMHelper.serializeDOMToString)
			.then(html => axios.post('/admin/app/dist/api/save-temp-page.php', {html}))
			.then(({data}) => this.iframe.load(`../../../../${data.file_name}`))
			.then(() => this.enableEditing())
			.then(() => this.injectStyles())
			.then(cb)
	}

	save(onSaved, onError) {
		this.isLoading()
		const newDom = this.virtualDom.cloneNode(this.virtualDom)
		DOMHelper.unwrapTextNodes(newDom)
		const html = DOMHelper.serializeDOMToString(newDom)
		axios.post('/admin/app/dist/api/save-page.php', {pageName: this.currentPage, html})
			.then(onSaved)
			.catch(onError)
			.finally(this.isLoaded)
	}

	enableEditing() {
		this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
			const id = element.getAttribute('nodeid')
			const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`)
			new EditorText(element, virtualElement)
		})
	}

	injectStyles() {
		const style = this.iframe.contentDocument.createElement('style')
		style.innerHTML = `
			text-editor:hover {
				outline: 3px solid orange;
				outline-offset: 8px;
			}
			text-editor:focus {
				outline: 3px solid red;
				outline-offset: 8px;
			}
		`
		this.iframe.contentDocument.head.appendChild(style)
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

	isLoading() {
		this.setState({
			loading: true
		})
	}

	isLoaded() {
		this.setState({
			loading: false
		})
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
		const {loading} = this.state
		let spinner

		// eslint-disable-next-line @babel/no-unused-expressions
		loading ? spinner = <Spinner active/> : spinner = <Spinner/>

		return (
			<>
				<iframe src={this.currentPage} frameBorder="0"></iframe>

				<div className="panel">
					<button 
						className="uk-button uk-button-primary"
						uk-toggle="target: #modal-save"
					>
						Сохранить
					</button>
				</div>

				{spinner}

				<ModalPortal>
					<div className="uk-modal-dialog uk-modal-body">
						<h2 className="uk-modal-title">Сохранение</h2>
						<p>Вы уверены ?</p>
						<p className="uk-text-right">
							<button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
							<button 
								onClick={() => this.save(() => {
									UIkit.notification({message: 'Сохранено', status: 'success'})
								},
								() => {
									UIkit.notification({message: 'Не удалось сохранить', status: 'danger'})
								})}
								className="uk-button uk-button-primary uk-modal-close" 
								type="button"
							>
									Сохранить</button>
						</p>
					</div>
				</ModalPortal>
			</>
		)
	}
}