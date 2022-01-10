const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
function init() {
    showAll();
    document.getElementById('btnCreate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            userId: document.getElementById('name').value,
            current_value: document.getElementById('price').value,
            discount: document.getElementById('sale').value,
            type_of_delivery: document.getElementById('nacin').value,
            urgent: document.getElementById('urgent').checked
        };
        if(validate(data)){
            fetch('http://localhost:8080/admin/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( el => {
                    console.log(el)
                    showAll();
                });
            }
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            userId: document.getElementById('name').value,
            current_value: document.getElementById('price').value,
            discount: document.getElementById('sale').value,
            type_of_delivery: document.getElementById('nacin').value,
            urgent: document.getElementById('urgent').checked,
            updateId: document.getElementById('upd').value
        };
        if(validate(data)){
        fetch('http://localhost:8080/admin/orders', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                console.log(el)
                showAll();
            });
        }
    });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            id: document.getElementById('del').value
        }
        
        
        fetch('http://localhost:8080/admin/orders', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                console.log(el)
                showAll();
            });
        
    });
}


function showAll(){
    fetch('http://localhost:8080/admin/orders', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
    .then( res => res.json() )
    .then( rows => {
        const tbodyEl = document.querySelector('tbody');
        tbodyEl.innerHTML = '';
        rows.forEach(element => {
            tbodyEl.innerHTML += `
            <tr>
                <td id="${element.id}">${element.id}</th>
                <td>${element.current_value}</td>
                <td>${element.userId}</td>
                <td>${element.discount}</td>
                <td>${element.type_of_delivery}</td>
                <td>${element.urgent}</td>
            </tr>`;
        });
    });
}


function validate(data){
    if(!(/^[a-zA-Z]{2,150}$/.test(data.type_of_delivery))){
        alert('Invalid type_of_delivery format');
        return false;
    }
    const reg = new RegExp('^[0-9]+$');
    if(!(reg.test(data.current_value))){
        alert('Invalid current_value format');
        return false;
    }
    if(!(reg.test(data.discount))){
        alert('Invalid discount format');
        return false;
    }
    if(!(reg.test(data.userId))){
        alert('Invalid userId format');
        return false;
    }

    return true;
}