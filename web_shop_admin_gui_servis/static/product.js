function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

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
            .catch( err => res.status(500).json(err) );
    });

    document.getElementById('btnUpdate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value,
            rate: document.getElementById('rate').value,
            id: document.getElementById('del').value
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
            .catch( err => res.status(500).json(err) );
    });

    document.getElementById('btnDelete').addEventListener('click', e => {
        e.preventDefault();

        id = document.getElementById('del').value;
        
        fetch('http://localhost:8080/admin/products', {
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
            tbodyEl.innerHTML += `
            <tr>
                <td id="${element.id}">${element.id}</th>
                <td>${element.name}</td>
                <td>${element.description}</td>
                <td>${element.price}</td>
                <td>${element.category}</td>
                <td>${element.rate}</td>
            </tr>`;

            
        });
    });
}