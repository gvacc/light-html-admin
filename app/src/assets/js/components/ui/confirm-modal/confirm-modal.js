import React from 'react'
import UIkit from 'uikit'

// eslint-disable-next-line react/prop-types
const ConfirmModal = ({modal, target, method}) => {
	return (
		<div id={target} uk-modal={modal.toString()}>
			<div className="uk-modal-dialog uk-modal-body">
				<h2 className="uk-modal-title">Сохранение</h2>
				<p>Вы уверены ?</p>
				<p className="uk-text-right">
					<button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
					<button 
						onClick={() => method(() => {
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
		</div>
	)
}

export default ConfirmModal