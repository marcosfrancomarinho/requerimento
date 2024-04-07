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