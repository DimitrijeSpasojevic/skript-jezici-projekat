
const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];

function init() {
    showAll();
    document.getElementById('btnCreate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            rate: document.getElementById('rate').value
        };

        fetch('http://localhost:8080/admin/products', {
            method: 'POST',
            headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( product => {
                console.log(product);
                showAll();
            })
            .catch( err => console.log("neuspela promena") );
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            rate: document.getElementById('rate').value,
        };

        fetch('http://localhost:8080/admin/products', {
            method: 'PUT',
            headers: {
                 'Content-Type': 'application/json',
                 'Authorization': `Bearer ${token}`
             },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( product => {
                console.log(product);
                showAll();
            })
            .catch( err => console.log(err));
    });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();
        const data = {
            id: document.getElementById('del').value
        }
        
        fetch('http://localhost:8080/admin/products', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        })
            .then( res => res.json() )
            .then( el => {
                console.log(data)
                showAll();
            });
        
    });
}

function showAll(){
    fetch('http://localhost:8080/admin/products', {
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
                <td>${element.name}</td>
                <td>${element.description}</td>
                <td>${element.price}</td>
                <td>${element.categoryId}</td>
                <td>${element.rate}</td>
            </tr>`;

            
        });
    });
}