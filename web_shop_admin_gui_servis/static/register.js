function init() {

    const cookies = document.cookie.split('=');
    const token = cookies[cookies.length - 1];

    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();
        console.log("Stisnuto dugme!")
        const data = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            role: document.getElementById('admin').checked
        };
        if(validate(data)){
            fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( usr => {
                    console.log(usr);
                    window.alert(`Uspesno kreiran user ${usr.first_name}`);
                    window.location.href = 'login.html';
                }).catch(error => { 
                    console.log(error)
                });
        }
    });
}

function validate(data){
    var re = /\S+@\S+\.\S+/;
    if(!re.test(data.email)){
        alert('Invalid email format');
        return false;
    }
    return true;
}