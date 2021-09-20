import React from 'react'

// eslint-disable-next-line react/prop-types
const ChooseModal = ({modal, target, data, redirect}) => {

	// eslint-disable-next-line react/prop-types
	const pageList = data.map((item, idx) => {
		return (
			<li key={idx}>
				<a 
					className="uk-link-muted uk-modal-close"
					onClick={(e) => redirect(item, e)}
				>
					{item}</a>
			</li>
		)
	})

	return (
		<div id={target} uk-modal={modal.toString()}>
			<div className="uk-modal-dialog uk-modal-body" id={target}>
				<h2 className="uk-modal-title">Открыть</h2>
				<ul className="uk-list uk-list-divider">
					{pageList}
				</ul>
				<p className="uk-text-right">
					<button className="uk-button uk-button-default uk-modal-close" type="button">Отменить</button>
				</p>
			</div>
		</div>
	)
}

export default ChooseModal