const url = `http://localhost:3000/signup`
const signup = document.querySelector('#Signup')
signup.addEventListener('submit', createUser)

async function createUser(e){
    e.preventDefault();
    const data = {
        name: e.target.name.value,
        email: e.target.email.value,
        pnumber: e.target.pnumber.value,
        password: e.target.password.value,
    }
    console.log(data)
    const res = axios.post(`${url}/addUser`, data)

}