const url = `http://localhost:3000/user`
const msgUrl = `http://localhost:3000/message`

window.addEventListener('DOMContentLoaded', rendering)
document.querySelector('#messageForm').addEventListener('submit', sendMessage)
document.querySelector('.logoutBtn').addEventListener('click', logout)
const token = localStorage.getItem('authToken')
async function rendering(){
    try{
        if(!token){
            window.location = '../login/login.html'
        }
        const res = await axios.get(`${url}/getAllUsers`, {
            headers: {
                auth : token
            }
        })
        showOutput(res)
    }
    catch(err){
        console.log(err)
    }
}

function showOutput(res){
    
    res.data.forEach(entry =>{
        const div = document.createElement('div')
        div.textContent = `${entry.name} Joined`
        document.querySelector('.joinedUsers').appendChild(div)

    })
}

async function sendMessage(e){
    e.preventDefault();
    const message = e.target.message.value;
try{
    const res = await axios.post(`${msgUrl}/sendMessage`, {message : message}, {
        headers:{
            auth: token
        }
    })
    if(res.status == 200){
        e.target.message.value=""
    }
}
   catch(err){
    console.log(err)
   }
    
}

function logout(){
    localStorage.removeItem('authToken')
    window.location.href = '../login/login.html';

}