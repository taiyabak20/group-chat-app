const url = `http://localhost:3000/user`
const msgUrl = `http://localhost:3000/message`
const groupUrl = `http://localhost:3000/group`

window.addEventListener('DOMContentLoaded', rendering)
document.querySelector('#messageForm').addEventListener('submit', sendMessage)
document.querySelector('.logoutBtn').addEventListener('click', logout)
const token = localStorage.getItem('authToken')
let messagesArray = [];
async function rendering(){
    try{
        if(!token){
            window.location = '../login/login.html'
        }
    // fetchData(token)
    //    setInterval(async () => {
    //     await fetchData(token);

    // }, 1000); 
    fetchGrps()
    }
    catch(err){
        console.log(err)
    }
}


let  id;
async function fetchData(token){
    document.querySelector('.messages').textContent = ""
    document.querySelector('.joinedUsers').textContent = ""
    messagesArray = JSON.parse(localStorage.getItem('messages'))
   
    if(messagesArray){
    id = messagesArray.length
    }
    const res = await axios.get(`${url}/getAllUsers`, {
        headers: {
            auth : token
        }
    })
    const messages= await axios.get(`${msgUrl}/getMessages/${id}`, {
        headers : {
            auth: token
        }
    })
    showOutput(res)
    messagesArray = [...messagesArray, ...messages.data]
    localStorage.setItem("messages", JSON.stringify(messagesArray))
    showMessages(messagesArray)
}
function showOutput(res){
    
    res.data.forEach(entry =>{
        const p = document.createElement('p')
        p.textContent = `${entry.name} Joined`
        document.querySelector('.joinedUsers').appendChild(p)

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

function showMessages(res){
    
    res.forEach(entry =>
        {
            const p = document.createElement('p')
            p.textContent = `${entry.user.name}: ${entry.message}`;
            document.querySelector('.messages').appendChild(p)
        }
        )
}
document.querySelector('.selectBtn').addEventListener('click', getMembers)
document.querySelector('#groupForm').addEventListener('submit', createGroup)
document.querySelector('.groupBtn').addEventListener('click', openForm)
let membersToBeAdded = []
async function getMembers(e){
    e.preventDefault()
    const users = await axios.get(`${url}/getAllUsers`, {
        headers:{
            auth: token
        }
    })
    
    users.data.forEach(entry =>{
        const user = document.createElement('div');
        const addBtn = document.createElement('button');
        addBtn.textContent = 'add'
        addBtn.classList.add(entry.id)
        user.textContent = entry.name;
        document.querySelector('.users').appendChild(user);
        document.querySelector('.users').appendChild(addBtn);

        addBtn.addEventListener('click', (e)=>{
            e.preventDefault()
            const value = addBtn.getAttribute('class')
            membersToBeAdded.push(value)
        })
    
    })
    console.log(users.data)
}
async function createGroup(e){
    e.preventDefault()
   const data = {
    name: e.target.name.value,
    member: membersToBeAdded
   }

   const result = await axios.post(`${groupUrl}`, data, {
    headers:{
        auth: token
    }
   })
   console.log(result.data)
   const availableGrps = document.querySelector('.availableGrps')
   const groupDiv = document.createElement('div')
   groupDiv.textContent = result.data.newGroup.name
   availableGrps.appendChild(groupDiv)
}

function openForm(){

}

async function fetchGrps(){
    const groups = await axios.get(`${groupUrl}/getAllGroups`, {
        headers: {
            auth: token
        }
    })
    
    console.log(groups.data)
}