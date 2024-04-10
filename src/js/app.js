const $ = selector => {
    const element = document.querySelectorAll(selector)
    return element.length > 1 ? element : element[0]
}
const separator = (string) => {
    if (string.length <= 12) {
        return string.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return string.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}
const mTel = (tel) => {
    return tel
        .replace(/(.{0})(\d)/, "$1($2")
        .replace(/(.{3})(\d)/, "$1)$2")
        .replace(/(.{4})$/, "-$1")
}
$("form").onsubmit = function (event) {
    event.preventDefault()
    const formData = Object.fromEntries(new FormData(this))
    createForm.bind(formData)()
    pdfGenerator()
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
        $("#data_" + key).innerText = value
    })
}
$("#cpf").onblur = function () {
    this.type = "text"
    this.value = separator(this.value)
}
$("#phone").onblur = function () {
    this.value = mTel(this.value)
}
$("#cpf").onclick = function () {
    this.type = "number"
    this.value = ""
}
$("#phone").onclick = function () {
    this.value = ""
}
function pdfGenerator() {
    const opt = {
        margin: 1,
        filename: 'myfile.pdf',
        html2canvas: { scale: 1 },
        jsPDF: { orientation: 'portrait' }
    };
    html2pdf().set(opt).from($("#form_data")).save()
}
