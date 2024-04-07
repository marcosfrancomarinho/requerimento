const $ = selector => {
    const element = document.querySelectorAll(selector)
    return element.length > 1 ? element : element[0]
}
$("form").onsubmit = function (event) {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(this))
    createRequirement.bind(formData)()
}
$("#marital_status").onchange = function () {
    const response = ["casado", "convivente"].some(status => {
        return status === this.value
    })
    $("#spouse").classList.toggle("hide", !response)
}
function createRequirement() {
    console.log(this)
    $("#form-datas").innerHTML = `
        <div>Nome: ${this.name}</div>
    `
}
async function api_1(cep) {
    const url_1 = `https://viacep.com.br/ws/${cep}/json/`
    return await fetch(url_1)

}
async function api_2(cep) {
    const url_2 = `https://brasilapi.com.br/api/cep/v1/${cep}`
    return await fetch(url_2)
}
async function apiCep(cep) {
    const response = await Promise.race([api_1(cep), api_2(cep)])
    if (response.status === 200) {
        return response.json()
    }
}
$("#cep").onblur = async function () {
    const number = Number(this.value)
    const {
        logradouro, bairro, uf,
        localidade, state, city,
        neighborhood, street
    } = await apiCep(number)
    const info = [
        [logradouro, street],
        [bairro, neighborhood],
        [localidade, city],
        [uf, state]
    ]
    $(".automatic_filling").forEach((elment, idx) => {
        elment.value = info[idx][0] ?? info[idx][1]
    })
}
