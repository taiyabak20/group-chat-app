const url = `http://localhost:3000/login`
const btn = document.querySelector('#login')
btn.addEventListener('submit', loginUser)

async function loginUser(e){
    e.preventDefault();
    const data = {
        email: e.target.email.value,
        password: e.target.password.value,
    }
    // const res = await axios.post(url, data)
    console.log(data)

}