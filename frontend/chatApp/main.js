const url = `http://localhost:3000/user`
window.addEventListener('DOMContentLoaded', rendering)
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