import {useEffect} from 'react'
import {createPortal} from 'react-dom'

const ModalPortal = props => {
	const modalRoot = document.createElement('div')
	modalRoot.setAttribute('uk-modal', 'true')
	modalRoot.id = 'modal-save'
  
	useEffect(() => {
		document.body.appendChild(modalRoot)
		return () => {
			document.body.removeChild(modalRoot)
		}
	})
  
	return createPortal(props.children, modalRoot)
} 
  
export default ModalPortal