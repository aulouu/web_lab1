function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function validateX() {
    let element = document.getElementById("x");
    let x = +element.value.replace(',', '.');
    if (!isNumeric(x) || parseFloat(x) >= 5 || parseFloat(x) <= -3) {
        element.setCustomValidity("Enter an integer between -3 and 5 (not including)");
        element.reportValidity();
        return false;
    } else {
        element.setCustomValidity("");
        element.reportValidity();
        return true;
    }

}

function validateY() {
    let element = document.getElementById("y");
    let y = +element.value.replace(',', '.');
    if (!isNumeric(y) || parseFloat(y) >= 3 || parseFloat(y) <= -3) {
        element.setCustomValidity("Enter an integer between -3 and 3 (not including)");
        element.reportValidity();
        return false;
    } else {
        element.setCustomValidity("");
        element.reportValidity();
        return true;
    }

}

function validateR() {
    checkboxes = document.querySelectorAll('input[type=checkbox]');
    console.log('r_check');
    for (let checkbox of checkboxes) {
        if (checkbox.checked) {
            return true;
        }
    }
    checkboxes[4].setCustomValidity("Please choose box");
    checkboxes[4].reportValidity();
    return false;
}

function validateAll() {
    return validateX() & validateY() & validateR();
}

let last_row;
function addToTable(data) {
    let row = document.getElementById("restable").insertRow();
    let cellId = 0;
    row.insertCell(cellId++).innerText = data.x;
    row.insertCell(cellId++).innerText = data.y;
    row.insertCell(cellId++).innerText = data.r;
    row.insertCell(cellId++).innerText = data.hit;
    row.insertCell(cellId++).innerText = new Date(data.curtime).toLocaleTimeString();
    row.insertCell(cellId++).innerText = data.exectime;

    if(last_row !== undefined) last_row.className = '';
    row.classList.add(data.hit === 'Hit' ? 'last-row-hit' : 'last-row-miss');
    last_row = row;

    document.getElementById("restable").scrollTo(0, document.getElementById("restable").scrollHeight);
}

function load() {
    fetch("./php/load.php", {
        method: 'POST'
    }).then(response => {
        return response.json();
    }).then(data => {
        if(data.length > 0) data.forEach(addToTable);
    });
}

function onLoad(event) {
    load();
    document.getElementById("validate_button").addEventListener("click", event => {
        event.preventDefault();
        if (validateAll()) {
            let x = +document.querySelector("#x").value;
            let y = +document.querySelector("#y").value;
            for (let checkbox of checkboxes) {
                if (checkbox.checked) {
                    let r = +checkbox.value;
                    let formData = new FormData();
                    formData.append('x', x);
                    formData.append('y', y);
                    formData.append('r', r);

                    fetch("./php/main.php", {
                        method: 'POST',
                        body: formData
                    }).then(response => {
                        return response.json();
                    }).then(data => {
                        if('error' in data) throw data.error;
                        addToTable(data);
                    }).catch(e => {
                        alert(`Ошибка в получении ответа: ${e}`);
                    });
                }
            }
        }
    });

    document.getElementById("reset_button").addEventListener("click", event => {
        event.preventDefault();
        fetch("./php/clear.php", {
            method: 'POST'
        });
        location.reload();
    });
}

window.addEventListener("load", onLoad);