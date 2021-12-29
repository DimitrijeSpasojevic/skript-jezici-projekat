function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('btnCreate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            popularity: document.getElementById('popularity').value,
            description: document.getElementById('description').value,
        };

        fetch('http://localhost:8080/admin/categories', {
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
            });
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            popularity: document.getElementById('popularity').value,
            description: document.getElementById('description').value,
        };

        fetch('http://localhost:8080/admin/categories', {
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
            });
    });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        id = document.getElementById('del').value;
        
        fetch('http://localhost:8080/admin/categories', {
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
            });
        
    });
}

function showAll(){
    fetch('http://localhost:8080/admin/categories', {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    })
    .then( res => res.json() )
    .then( rows => {
        const tbodyEl = document.querySelector('tbody');
        rows.forEach(element => {
            tbodyEl.innerHTML += `
            <tr>
                <td id="${element.id}">${element.id}</th>
                <td>${element.name}</td>
                <td>${element.description}</td>
                <td>${element.popularity}</td>
                <td>${element.quantity_of_product}</td>
            </tr>`;
        });
    });
}