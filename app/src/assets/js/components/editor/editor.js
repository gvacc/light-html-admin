import React, {Component} from 'react'
import axios from 'axios'
import '../../helpers/iframe-loader.js'
import UIkit from 'uikit'
import DOMHelper from '../../helpers/dom-helper.js'
import EditorText from '../editor-text/'
import ConfirmModal from '../ui/confirm-modal/'
import Spinner from '../ui/spinner/'
import ChooseModal from '../ui/choose-modal/'
import Panel from '../panel/'
import EditorMeta from '../editor-meta/'
import EditorImages from '../editor-images/'
import Login from '../login'


export default class Editor extends Component {
	constructor() {
		super()
		this.currentPage = 'index.html'
		this.state = {
			pageList: [],
			newPageName: '', //TODO: Поменять на fileName,
			loading: true,
			backupsList: [],
			auth: false,
			loginError: false,
			loginLengthError: false
		}

		this.isLoading = this.isLoading.bind(this)
		this.isLoaded = this.isLoaded.bind(this)
		this.save = this.save.bind(this)
		this.init = this.init.bind(this)
		this.login = this.login.bind(this)
		this.logout = this.logout.bind(this)
		this.restoreBackup = this.restoreBackup.bind(this)
	}

	componentDidMount() {
		this.checkAuth()
	}

	componentDidUpdate(prevProps, prevState) {
		if(this.state.auth !== prevState.auth) {
			this.init(this.currentPage, null)
		}
	}

	checkAuth() {
		axios.get('/admin/app/dist/api/check-auth.php')
			.then(res => {
				this.setState({
					auth: res.data.auth
				})
			})
	}

	login(password) {
		if(password.length > 5) {
			axios.post('/admin/app/dist/api/login.php', {password})
				.then(res => {
					this.setState({
						auth: res.data.auth,
						loginError: !res.data.auth,
						loginLengthError: false
					})
				})
		} else {
			this.setState({
				loginError: false,
				loginLengthError: true
			})
		}
	}

	init(page, e) {
		if(e) {
			e.preventDefault()
		}
		if(this.state.auth) {
			this.isLoading()
			this.iframe = document.querySelector('iframe')
			this.open(page, this.isLoaded)
			this.loadPageList()
			this.loadBackupList()
		}
		
	}

	async open(page, cb) {
		this.currentPage = page

		await axios.get(`../../../../${page}` + '?rnd=' + Math.random().toString().substring(2))
			.then(({data}) => DOMHelper.parseStrToDOM(data))
			.then(DOMHelper.wrapTextNodes)
			.then(DOMHelper.wrapImages)
			.then(dom => {
				this.virtualDom = dom
				return dom
			})
			.then(DOMHelper.serializeDOMToString)
			.then(html => axios.post('/admin/app/dist/api/save-temp-page.php', {html}))
			.then(() => this.iframe.load('../../../../temp4FbfoPl.html'))
			.then(() => axios.post('/admin/app/dist/api/delete-page.php' , {file_name: 'temp4FbfoPl.html'}))
			.then(() => this.enableEditing())
			.then(() => this.injectStyles())
			.then(cb)	
		this.loadPageList()	
	}

	async save() {
		this.isLoading()
		const newDom = this.virtualDom.cloneNode(this.virtualDom)
		DOMHelper.unwrapTextNodes(newDom)
		DOMHelper.unwrapImages(newDom)
		const html = DOMHelper.serializeDOMToString(newDom)
		await axios.post('/admin/app/dist/api/save-page.php', {pageName: this.currentPage, html})
			.then(() => this.showNotifications('Cохранено!', 'success'))
			.catch(() => this.showNotifications('Произошла ошибка', 'danger'))
			.finally(this.isLoaded)
		
		this.loadBackupList()
	}

	showNotifications(message, status) {
		UIkit.notification({message, status})
	}

	enableEditing() {
		this.iframe.contentDocument.body.querySelectorAll('text-editor').forEach(element => {
			const id = element.getAttribute('nodeid')
			const virtualElement = this.virtualDom.body.querySelector(`[nodeid="${id}"]`)
			new EditorText(element, virtualElement)
		})

		this.iframe.contentDocument.body.querySelectorAll('[editableimgid]').forEach(element => {
			const id = element.getAttribute('editableimgid')
			const virtualElement = this.virtualDom.body.querySelector(`[editableimgid="${id}"]`)
			new EditorImages(element, virtualElement, this.isLoading, this.isLoaded, this.showNotifications)
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
			[editableimgid]:hover {
				outline: 3px solid orange;
				outline-offset: 8px;
			}
		`
		this.iframe.contentDocument.head.appendChild(style)
	}

	async loadPageList() {
		try {
			const {data} = await axios.get('/admin/app/dist/api/page-list.php')
			this.setState({pageList: data})
		} catch(e){
			alert(e.response.data.message)
		}
	}

	loadBackupList() {
		axios.get('./backups/backups.json')
			.then(res => this.setState(
				{backupsList: res.data.filter(backup => backup.page ===  this.currentPage)}
			))
	}

	restoreBackup(backup, e) {
		if(e) {
			e.preventDefault()
		}
		UIkit.modal.confirm('Все несохраненные данные будут потеряны!', {
			labels: {ok: 'Восстановить', cancel: 'Отмена'}
		}).then(() => {
			this.isLoading()
			return axios.post('/admin/app/dist/api/restore-backup.php', {'page': this.currentPage, 'file': backup})
		}).then(() => {
			this.open(this.currentPage, this.isLoaded)
		})
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

	logout() {
		axios.get('/admin/app/dist/api/logout.php')
			.then(() => window.location.replace('/'))
	}

	render() {
		const {loading, pageList, backupsList, auth, loginError, loginLengthError} = this.state
		let spinner

		// eslint-disable-next-line @babel/no-unused-expressions
		loading ? spinner = <Spinner active/> : spinner = <Spinner/>

		if(!auth) {
			return <Login 
				login={this.login} 
				lengthErr={loginLengthError}
				logErr={loginError}
			/>
		}

		return (
			<>
				<iframe src="" frameBorder="0"></iframe>
				<input id="img-upload" type="file" accept="image/*" style={{display: 'none'}}></input>
				{spinner}
				<Panel/>
				<ConfirmModal 
					modal={true} 
					target="modal-save" 
					method={this.save}
					text={{
						title: 'Сохранение',
						butn: 'Опубликовать'
					}}
				/>
				<ConfirmModal 
					modal={true} 
					target="modal-logout" 
					method={this.logout}
					text={{
						title: 'Выход',
						btn: 'Выйти'
					}}
				/>
				<ChooseModal modal={true} target="modal-open" data={pageList} redirect={this.init}/>
				<ChooseModal modal={true} target="modal-backup" data={backupsList} redirect={this.restoreBackup}/>
				{this.virtualDom ? <EditorMeta modal={true} target="modal-meta" virtualDom={this.virtualDom}/> : false }
			</>
		)
	}
}