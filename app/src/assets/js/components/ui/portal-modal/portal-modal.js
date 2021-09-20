import {useEffect} from 'react'
import ReactDOM from 'react-dom'

const PortalModal = (props) => {
	const modalRoot = document.createElement('div')
	modalRoot.setAttribute('uk-modal', 'bg-close: false')
	modalRoot.id = props.id

	useEffect(() => {
		document.body.appendChild(modalRoot)
		return () => {
			document.body.removeChild(modalRoot)
		}
	})

	return ReactDOM.createPortal(props.children, modalRoot)
}

export default PortalModal
