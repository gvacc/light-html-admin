/* eslint-disable react/prop-types */
import React from 'react'

// eslint-disable-next-line react/prop-types
const ConfirmModal = ({modal, target, method, text}) => {
	const {title, btn} = text
	return (
		<div id={target} uk-modal={modal.toString()}>
			<div className="uk-modal-dialog uk-modal-body">
				<h2 className="uk-modal-title">{title}</h2>
				<p>Вы уверены ?</p>
				<p className="uk-text-right">
					<button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
					<button 
						onClick={() => method()}
						className="uk-button uk-button-primary uk-modal-close" 
						type="button"
					>
						{btn}</button>
				</p>
			</div>
		</div>
	)
}

export default ConfirmModal