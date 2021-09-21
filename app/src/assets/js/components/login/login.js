/* eslint-disable @babel/no-unused-expressions */
/* eslint-disable react/prop-types */
import React, {Component} from 'react'
export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			password: ''
		}
	}

	onPasswordChange(e) {
		this.setState({
			password: e.target.value
		})
	}

	render() {
		const {password} = this.state
		const {login, lengthErr, logErr} = this.props

		let renderLogErr, renderLengthErr

		logErr ? renderLogErr = <span className="login-error">Введен неправильный пароль</span> : null
		lengthErr ? renderLengthErr = <span className="login-error">Пароль должен быть длинее 5 символов</span> : null
		
		return (
			<div className="login-container">
				<div className="login">
					<h2 className="uk-modal-title uk-text-center">Авторизация</h2>
					<div className="uk-margin-top uk-text-lead">Пароль</div>
					<input 
						type="password" 
						name="" 
						id="" 
						className="uk-input uk-margin-top" 
						value={password}
						onChange={(e) => this.onPasswordChange(e)}
					/>

					{renderLengthErr}
					{renderLogErr}

					<button 
						className="uk-button uk-button-primary uk-margin-top"
						type="button"
						onClick={() => login(password)}
					>
						Вход
					</button>
				</div>
			</div>
		)
	}
}