const url = `http://localhost:3000/user`
const msgUrl = `http://localhost:3000/message`
const groupUrl = `http://localhost:3000/group`
const membersUrl = `http://localhost:3000/member`
import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

const socket = io( 'http://127.0.0.1:3000', {
  auth: {
    token: localStorage.getItem('authToken')
  }
});

socket.on('connect', () => {
  //console.log('Connected to server');
  socket.on('message', (data) => {
    showUpdatedMessages(data)
});
});


window.addEventListener('DOMContentLoaded', rendering)
document.querySelector('#messageForm').addEventListener('submit', sendMessage)
document.querySelector('.logoutBtn').addEventListener('click', logout)
document.querySelector('.grpName').addEventListener('click', showGrpMembers)
document.querySelector('.groupBtn').addEventListener('click', openForm)

const token = localStorage.getItem('authToken')
const gId = localStorage.getItem('groupId')

async function rendering(){
    try{
        if(!token){
            window.location = '../login/login.html'
        }
        if(gId){
            document.querySelector('.grpName').style.display = "block"
         }
     fetchData()
     fetchGrps()
     
    }
    catch(err){
        console.log(err)
    }
}
let userName;

async function fetchData(){
    const groupId = localStorage.getItem('groupId')
    document.querySelector('.messages').textContent = ""
    document.querySelector('.joinedUsers').textContent = ""
    

    const res = await axios.get(`${url}/getAllUsers/${groupId}`, {
        headers: {
            auth : token
        }
    })
   
    const messages= await axios.get(`${msgUrl}/getMessages/${groupId}`, {
        headers : {
            auth: token
        }
    })
    //console.log(messages)
    showOutput(res)
    adminPowers(res)
    showMessages(messages.data)
    userName = (res.data.you)
}
function showOutput(res){
    
    res.data.users.forEach(entry =>{
        const p = document.createElement('p')
        p.classList.add('joinedUser')
        p.textContent = `${entry.name} Joined`
        document.querySelector('.joinedUsers').appendChild(p)

    })
    
}
function scrollToBottom() {
    const element = document.querySelector('#chat')
    element.scrollTop = element.scrollHeight
}

async function sendMessage(e) {
  e.preventDefault()
  const input  = e.target.message;
  const message = input.value;
  socket.emit('message', message);
  try{
        const groupId = localStorage.getItem('groupId')
        const res = await axios.post(`${msgUrl}/sendMessage/${groupId}`, {message : message}, {
            headers:{
                auth: token
            }
        })
        if(res.status == 200){
            input.value = '';
            
        }
    }
       catch(err){
        console.log(err)
       }
}

function showUpdatedMessages(data){
    const p = document.createElement('p')
    p.textContent = `${userName}: ${data}`;
    document.querySelector('.messages').appendChild(p)
    scrollToBottom()
   
}

function showMessages(res){
    
    res.forEach(entry =>
        {
            const p = document.createElement('p')
            p.textContent = `${entry.user.name}: ${entry.message}`;
            document.querySelector('.messages').appendChild(p)
            scrollToBottom()
        }
        )
        
}



// -----------------------Group Section----------------------------

document.querySelector('.selectBtn').addEventListener('click', getMembers)
document.querySelector('.submitGrp').addEventListener('click', createGroup);
document.querySelector('.joinGrpBtn').addEventListener('click', joinGrp);

let membersToBeAdded = []
async function getMembers(e){
   e.preventDefault()
    const users = await axios.get(`${url}/getAllUsers`, {
        headers:{
            auth: token
        }
    })

    const toShow = document.querySelector('.users');
    selection(users, toShow)
}
function selection(users, toShow){
    users.data.forEach(entry => {
        const userContainer = document.createElement('div');
        const user = document.createElement('p');
        const addBtn = document.createElement('button');
       
    
        addBtn.textContent = 'add';
        addBtn.classList.add(entry.id);
        user.textContent = entry.name;
    
        userContainer.classList.add('user-container'); 
        userContainer.appendChild(user);
        userContainer.appendChild(addBtn);

                addBtn.style.width= '50px'; 
                addBtn.style.padding= '1px 2px'; 
                addBtn.style.fontSize = '15px';
                addBtn.style.margin = '0px 2px'
                user.style.margin = '0px auto'


        toShow.appendChild(userContainer);
    
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = addBtn.getAttribute('class');
            membersToBeAdded.push(value);
            addBtn.style.backgroundColor = "green"
        });
    
    });
}
    

async function createGroup(e){
    e.preventDefault()
   const data = {
    name: document.querySelector('#name').value,
    member: membersToBeAdded
   }

   const result = await axios.post(`${groupUrl}`, data, {
    headers:{
        auth: token
    }
   })
   //console.log(result.data)
   const availableGrps = document.querySelector('.availableGrps')
   const groupDiv = document.createElement('button')
   groupDiv.textContent = result.data.newGroup.name
   availableGrps.appendChild(groupDiv)
}


async function fetchGrps(){
    const groups = await axios.get(`${groupUrl}/getAllGroups`, {
        headers: {
            auth: token
        }
    })
    groups.data.forEach(entry =>{
        
        const groups = document.createElement('button')
        groups.textContent = entry.group.name;
        
        document.querySelector('.availableGrps').appendChild(groups)
         groups.addEventListener('click', (e)=>{
            e.preventDefault()
            localStorage.setItem('groupId', entry.groupId)
            document.querySelector('.messages').textContent = ''
            document.querySelector('.grpName').style.display = 'block'
            localStorage.setItem('groupName' , entry.group.name)
            fetchData()
           // console.log(entry)
        
         })

    })
}


async function joinGrp(e){
    e.preventDefault();
    document.querySelector('.groups').textContent = ""
    const res = await axios.get(`${groupUrl}/getAll`, {
        headers:{
            auth: token
        }
    })

    res.data.forEach(group =>{
        const userContainer = document.createElement('div');
        const user = document.createElement('p');
        const joinBtn = document.createElement('button');
       
    
        joinBtn.textContent = 'Join';
        joinBtn.classList.add(group.id);
        user.textContent = group.name;
    
        userContainer.classList.add('user-container'); 
        userContainer.appendChild(user);
        userContainer.appendChild(joinBtn);
        
                joinBtn.style.width= '50px'; 
                joinBtn.style.padding= '1px 2px'; 
                joinBtn.style.fontSize = '15px';
                joinBtn.style.margin = '0px 2px'
                user.style.margin = '0px auto'



    
                joinBtn.addEventListener('click',async (e) => {
            e.preventDefault();
            const value = joinBtn.getAttribute('class');
            //console.log(value)
            const res = await axios.post(`${membersUrl}/joinGrp`,{value},{
                headers:{
                    auth: token
                }
            })
            //console.log(res)
           alert(res.data)
        });

        document.querySelector('.groups').appendChild(userContainer)
    })
    
}



//----------------------------other--------------------------------


function openForm(){
    document.querySelector('#groupForm').style.display = 'block'
}
function showGrpMembers(){
    let grpMembers = document.querySelector('.grpMembers')
    let addUser = document.querySelector('.addUser')
    let groupAdmins = document.querySelector('.groupAdmins')
    if(grpMembers.style.display === 'none'){
         grpMembers.style.display = 'block';
         groupAdmins.style.display = 'block'; 
         addUser.style.display = 'block'; 
    }
    else{
        grpMembers.style.display = 'none';
         groupAdmins.style.display = 'none'; 
         addUser.style.display = 'none'; 
    }
    
}
function logout(){
    localStorage.removeItem('authToken')
    localStorage.removeItem('groupId')
    localStorage.clear()
    window.location.href = '../login/login.html';

}


//------------------------amdin Powers ------------------------------------
document.querySelector('.addUserBtn').addEventListener('click', findUser)

let isAdmin;
function adminPowers(res){
    document.querySelector('.grpName').textContent = localStorage.getItem('groupName')
    document.querySelector('.grpMembers').innerHTML = `Group Members:`
    document.querySelector('.groupAdmins').innerHTML = `Group Admins:`
    const you = res.data.you;
    res.data.users.forEach(member => {
        member.members.forEach(admin => {
            localStorage.setItem('isAdmin', admin.admin)

            if (admin.admin && member.id === you) {
                isAdmin = true;
                localStorage.setItem('isAdmin', isAdmin)
                
            }
        });})
        //console.log(you)
        res.data.users.forEach(member =>{
           // console.log(member.members)
           
            member.members.forEach(admin =>{
               
                if(admin.admin){
                    const span = document.createElement('div')  
                    span.textContent =  `${member.name} `
                    
                    span.classList.add('grpMember')
                    document.querySelector('.groupAdmins').appendChild(span)
                }
            })
            const adminPowers = document.createElement('button')  
            adminPowers.textContent =  `${member.name} `
            adminPowers.classList.add(`${member.id}`)
            adminPowers.classList.add('grpMember')
            
    
            document.querySelector('.grpMembers').appendChild(adminPowers)
    
            adminPowers.addEventListener('click', async (e) => {
                try {
                    const id = adminPowers.getAttribute('class')[0]
    
                   //console.log(id)
                   const isAdmin = localStorage.getItem('isAdmin')
                    //console.log(isAdmin)

                    if (isAdmin) {
                        const result = await Swal.fire({
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonText: 'Create Admin',
                            cancelButtonText: 'Remove',
                        });
                        const groupId = localStorage.getItem('groupId')
                        if (result.isConfirmed) {
                         
                          //console.log(groupId)
                            const res = await axios.post(`${membersUrl}/makeAdmin`, {id, groupId}, {
                                headers: {
                                    auth: token
                                }
                            });
                           alert(res.data.message)
                           e.target.style.color = "green"
    
                        } else if (result.dismiss === Swal.DismissReason.cancel){
                           const res = await axios.post(`${membersUrl}/removeMember`,{id, groupId}, {
                            headers: {
                                auth: token
                            }} )
                            alert(res.data.message)
                            e.target.style.color = "red"
                        }
                    }
                } catch (error) {
                    console.error('An error occurred:', error);
                }
            });
    
        })  
   } 
  
async function findUser(e){
   
    const groupId = localStorage.getItem('groupId')
    console.log(groupId)
    const toShow = document.querySelector('.userToBeAdded')
    toShow.textContent = ""
    const users = await axios.get(`${membersUrl}/notMembers/${groupId}`,{
        headers: {
            auth: token
        }
    })
//console.log(users)

   selection(users, toShow)
 const submitBtn = document.createElement('button')
 submitBtn.textContent= 'submit'
 submitBtn.addEventListener('click', addUser)
 toShow.appendChild(submitBtn)
 
}
 async function addUser(){
    const groupId = localStorage.getItem('groupId')
    //console.log(isAdmin)
    if(isAdmin){
    //console.log(membersToBeAdded)
    const res = await axios.post(`${membersUrl}/addToGroup/${groupId}`, {membersToBeAdded}, {
        headers:{
            auth: token
        }
    })
    if(res.status === 200){
        alert('user added')
    }
}
   else{
    alert('you are not an admin')
   }
 }
