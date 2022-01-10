function init() {

    document.getElementById('btn').addEventListener('click', e => {
        e.preventDefault();
        const data = {
            name: document.getElementById('name').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value
        };
        if(validate(data)){
            fetch('http://localhost:9000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then( res => res.json() )
                .then( el => {
                    if (el.msg) {
                        alert(el.msg);
                    } else {
                        document.cookie = `token=${el.token};SameSite=Lax`;
                        window.location.href = 'index.html';
                    }
                }).catch("ne moze da procita json");
        }
    });
}

function validate(data){
    if(data.name.length < 1 || data.name.length > 30){
        alert('Invalid name format');
        return false;
    }
    if(data.password.length < 4 || data.password.length > 12){
        alert('Invalid password format');
        return false;
    }
    var re = /\S+@\S+\.\S+/;
    if(!re.test(data.email)){
        alert('Invalid email format');
        return false;
    }
    return true;
}