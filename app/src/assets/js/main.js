(() => {
const validate_file_name = (() => {
    const rg1=/^[^\\/:\*\?"<>\|]+$/; // forbidden characters \ / : * ? " < > |
    const rg2=/^\./; // cannot start with dot (.)
    const rg3=/^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
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

const add_page_buton = document.querySelector('#create-page')
const page_list = document.querySelector('.page-list')

const add_file_names_to_page_list = (file_names) => {
    const output = file_names.map((name) => {
        return '<p>' + name + '</p>'
    }).join('')
    page_list.insertAdjacentHTML('afterbegin', output)
}

const get_file_names = async () => {
    try {
        const response = await fetch('/admin/app/dist/api/')
        const data = await response.json()
        add_file_names_to_page_list(data)
    }catch(e) {
        console.log(e)
        alert('Ошибка при загрузке страниц, обновите страницу')
    }
}
get_file_names()

const add_new_page = async (evt) => {
    const candidate_file_name = document.querySelector('#create-page-name').value
    const file_name = validate_file_name(candidate_file_name)

    if(!file_name) {
        alert('Введите допустимое имя для файла!')
        return
    }
    try {
        const response = await fetch('/admin/app/dist/api/create-page.php', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({file_name})
        })
    
        const data = await response.json()
        add_file_names_to_page_list(data)
        alert('Страница создана!')
    } catch(e){
        alert(`Произошла ошибка, попробуйте еще раз`)
    }
}
add_page_buton.addEventListener('click', add_new_page)
})()