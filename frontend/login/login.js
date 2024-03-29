const url = `http://localhost:3000/user`
const btn = document.querySelector('#login')
btn.addEventListener('submit', loginUser)

async function loginUser(e){
    e.preventDefault();
    const data = {
        email: e.target.email.value,
        password: e.target.password.value,
        name: e.target.name.value,
    }
    try{
        const res = await axios.post(`${url}/loginUser`, data)
        if(res.status == 200){
            //console.log(res)
            localStorage.setItem('userName',  e.target.name.value)
            localStorage.setItem('authToken', res.data)
            //console.log('login Sucessful')
            window.location = '../chatApp/index.html'
        }
    }
   catch(err){
    console.log(err)
    if(err.response && err.response.status == 401){
        document.querySelector('.login').textContent = 'incorrect password';
    }
    else{
        document.querySelector('.login').textContent = 'user doesnt exist';

    }
   }

}