const $ = selector => {
    const element = document.querySelectorAll(selector)
    return element.length > 1 ? element : element[0]
}
$("form").onsubmit = function (event) {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(this))
    createForm.bind(formData)()
}
$("#status").onchange = function () {
    const response = ["casado", "convivente"].some(status => {
        return status === this.value
    })
    $("#spouse").classList.toggle("hide", !response)
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
    const {
        logradouro, street,
        bairro, neighborhood,
        localidade, city,
        uf, state,
    } = await apiCep(Number(this.value))
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
function createForm() {
    Object.keys(this).forEach(key => {
        const value = $("#" + key).value
        $("#data_" + key).innerText = key !== "email" ? value.toUpperCase() : value.toLowerCase()
    })
}
