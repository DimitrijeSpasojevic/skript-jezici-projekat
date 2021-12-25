function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('btnCreate').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            firstName: document.getElementById('name').value,
            lastName: document.getElementById('lastName').value,
            role: document.getElementById('role').value,
            email: document.getElementById('email').value,
            quantityOfMoney: document.getElementById('quantity').value,
            password: document.getElementById('password').value
        };

        fetch('http://localhost:8080/admin/users', {
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
            firstName: document.getElementById('name').value,
            lastName: document.getElementById('lastName').value,
            role: document.getElementById('role').value,
            email: document.getElementById('email').value,
            quantityOfMoney: document.getElementById('quantity').value,
            password: document.getElementById('password').value
        };

        fetch('http://localhost:8080/admin/users', {
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

        btn = document.getElementById('btnDelete').

        fetch('http://localhost:8080/admin/users', {
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
            });
    });
}