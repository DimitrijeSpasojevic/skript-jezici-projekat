
const cookies = document.cookie.split('=');
const token = cookies[cookies.length - 1];
function init() {
    console.log(token);
    document.getElementById('btnShow').addEventListener('click', e =>{
        e.preventDefault();

             fetch('http://localhost:8080/admin/users', {
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
                        <td>${element.first_name}</td>
                        <td>${element.last_name}</td>
                        <td>${element.role}</td>
                        <td>${element.email}</td>
                        <td>${element.quantity_of_money}</td>
                    </tr>`;
                });
            }).catch(console.log("Greska sa ipsisom tabele"));
    })

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
            window.alert(`Kreiran korisnik ${el.first_name}`)
        });
        showAll();
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

        fetch('http://localhost:8080/admin/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({email: document.getElementById('del').value})
        })
            .then( res => res.json() )
            .then( el => {
                console.log(el)
            });
    });
}

function showAll(){
    fetch('http://localhost:8080/admin/users', {
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
                <td>${element.first_name}</td>
                <td>${element.last_name}</td>
                <td>${element.role}</td>
                <td>${element.email}</td>
                <td>${element.quantity_of_money}</td>
            </tr>`;
        });
    }).catch(console.log("Greska sa ipsisom tabele"));
}