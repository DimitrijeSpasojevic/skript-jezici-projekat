function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('btnCreate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            usrID: document.getElementById('name').value,
            current_value: document.getElementById('price').value,
            discount: document.getElementById('sale').value,
            type_of_delivery: document.getElementById('nacin').value,
            urgent: document.getElementById('urgent').value
        };

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
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            usrID: document.getElementById('name').value,
            current_value: document.getElementById('price').value,
            discount: document.getElementById('sale').value,
            type_of_delivery: document.getElementById('nacin').value,
            urgent: document.getElementById('urgent').value,
            id: document.getElementById('del').value
        };

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
    });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        id = document.getElementById('del').value;
        
        fetch('http://localhost:8080/admin/orders', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(id)
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
        rows.forEach(element => {
            tbodyEl.innerHTML = '';
            tbodyEl.innerHTML += `
            <tr>
                <td id="${element.id}">${element.id}</th>
                <td>${element.current_value}</td>
                <td>${element.usrID}</td>
                <td>${element.discount}</td>
                <td>${element.type_of_delivery}</td>
                <td>${element.urgent}</td>
            </tr>`;
        });
    });
}