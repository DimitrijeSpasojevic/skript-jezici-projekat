function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            price: document.getElementById('price').value,
            description: document.getElementById('description').value,
            category: document.getElementById('category').value
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
            })
            .catch( err => res.status(500).json(err) );
    });
}