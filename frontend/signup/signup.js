const url = `http://localhost:3000/user`
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
    // console.log(data)
    try
    {
        const res =await axios.post(`${url}/addUser`, data)
        if(res.status == 201){
            document.querySelector('.signup').textContent = 'Successfuly signed up'
            e.target.name.value = ""
            e.target.email.value = ""
            e.target.pnumber.value = ""
            e.target.password.value = ""
        }
    }
   catch(err){
    console.log(err)
    if (err.response && err.response.status === 400) {
        document.querySelector('.signup').textContent = 'User already exists, Please Login!';
    }
   }
    

}