import React, {Component} from "react"
import axios from 'axios'

const validate_file_name = (() => {
    const rg1=/^[^\\/:\*\?"<>\|]+$/; 
    const rg2=/^\./; 
    const rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; 
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
                    .toLowerCase();
        } 
        return false
    }
})()

export default class Editor extends Component {
    constructor() {
        super()

        this.state = {
            pageList: [],
            newPageName: '' //TODO: Поменять на file_name
        }

        this.createNewPage = this.createNewPage.bind(this)
    }

    componentDidMount() {
        this.loadPageList()
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
        const {pageList} = this.state
        const pages = pageList.map((page, idx) => {
            return (
                <h1 key={idx}>
                    {page}
                    <a 
                        href="#"
                        onClick={() => this.deletePage(page)}
                        className="delete"
                    >
                        Удалить
                    </a>
                </h1>
            )
        })
        return (
            <>
                <input 
                    type='text' 
                    onChange={(e) => this.setState({newPageName: e.target.value})} 
                    type="text"
                />
                <button onClick={this.createNewPage}>Создать файл</button>
                {pages}
            </>
        )
    }
}