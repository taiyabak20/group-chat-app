const url = `http://localhost:3000/user`
const msgUrl = `http://localhost:3000/message`
const groupUrl = `http://localhost:3000/group`
const membersUrl = `http://localhost:3000/member`

window.addEventListener('DOMContentLoaded', rendering)
document.querySelector('#messageForm').addEventListener('submit', sendMessage)
document.querySelector('.logoutBtn').addEventListener('click', logout)
document.querySelector('.grpName').addEventListener('click', showGrpMembers)
const token = localStorage.getItem('authToken')

async function rendering(){
    try{
        if(!token){
            window.location = '../login/login.html'
        }
     fetchData()
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
async function fetchData(name){
    document.querySelector('.messages').textContent = ""
    document.querySelector('.joinedUsers').textContent = ""
    
   const groupId = localStorage.getItem('groupId')
   console.log(groupId)
    const res = await axios.get(`${url}/getAllUsers/${groupId}`, {
        headers: {
            auth : token
        }
    })
    showOutput(res)
    const messages= await axios.post(`${msgUrl}/getMessages/${id}`,{groupId}, {
        headers : {
            auth: token
        }
    })
    
    console.log(res.data)
    document.querySelector('.grpName').textContent = localStorage.getItem('groupName')
    document.querySelector('.grpMembers').innerHTML = `Group Members:`
    const you = res.data.you;
    let isAdmin = false;

res.data.users.forEach(member => {
    member.members.forEach(admin => {
        if (admin.admin && member.id === you) {
            isAdmin = true;
        }
    });})
    //console.log(you)
    res.data.users.forEach(member =>{
       // console.log(member)
       
        member.members.forEach(admin =>{
           // console.log(admin)
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

               console.log(id)
                if (isAdmin) {
                    const result = await Swal.fire({
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Create Admin',
                        cancelButtonText: 'Remove',
                    });
        
                    if (result.isConfirmed) {
                      const groupId = localStorage.getItem('groupId')
                      console.log(groupId)
                        const res = await axios.post(`${membersUrl}/makeAdmin`, {id, groupId}, {
                            headers: {
                                auth: token
                            }
                        });
                       alert(res.data.message)
                       

                    } else {
                       
                    }
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        });
        


    })
    
  
    showMessages(messages.data)
}
function showOutput(res){
    
    res.data.users.forEach(entry =>{
        const p = document.createElement('p')
        p.classList.add('joinedUser')
        p.textContent = `${entry.name} Joined`
        document.querySelector('.joinedUsers').appendChild(p)

    })
}

async function sendMessage(e){
    e.preventDefault();
    const message = e.target.message.value;
try{
    const groupId = localStorage.getItem('groupId')
    //console.log(groupId)
    const res = await axios.post(`${msgUrl}/sendMessage/${groupId}`, {message : message}, {
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
    localStorage.removeItem('groupId')
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



        document.querySelector('.users').appendChild(userContainer);
    
        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = addBtn.getAttribute('class');
            membersToBeAdded.push(value);
        });
    });
    
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
   const groupDiv = document.createElement('button')
   groupDiv.textContent = result.data.newGroup.name
   availableGrps.appendChild(groupDiv)
}

function openForm(){
    document.querySelector('#groupForm').style.display = 'block'
}
function showGrpMembers(){
    document.querySelector('.grpMembers').style.display = 'block';
    document.querySelector('.groupAdmins').style.display = 'block';
    
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
            e.preventDefault(e)
            localStorage.setItem('groupId', entry.groupId)
            document.querySelector('.messages').textContent = ''
            localStorage.setItem('groupName' , entry.group.name)
            fetchData()
           // console.log(entry)
        
         })

    })
}

document.querySelector('.joinGrpBtn').addEventListener('click', joinGrp)

async function joinGrp(e){
    e.preventDefault();
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



    
                joinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const value = joinBtn.getAttribute('class');
            console.log(value)
        });

        document.querySelector('.groups').appendChild(userContainer)
    })
    
}