import { useCallback, useEffect, useState } from 'react';
import '../styles/socialMedia.css';
import { useNavigate } from 'react-router';
import search from '../assets/search.svg';
import logout from '../assets/logout.svg';
import perfil from '../assets/perfil.svg';
import amigos from '../assets/amigos.svg';
import confi from '../assets/configuracion.svg';
import soporte from '../assets/support.svg';
import uVideo from '../assets/uploadVideo.svg'
import uPhoto from '../assets/uploadPhoto.svg'
import imageSelect from '../assets/imageSelect.svg'
import videoSelect from '../assets/videoSelect.svg'
import addFriend from '../assets/addFriend.svg'
import { UploadContent } from './uploadContent';
import { Items } from './items';




export const MainSocialMedia = ({ }) => {

    const socket = new WebSocket("wss://apisocialmedia-oesl.onrender.com")
    const navigate = useNavigate();
    const user = localStorage.getItem('socialUser');
    const userImage = localStorage.getItem('socialImageUser');

    const [select, setSelect] = useState(null);
    const [contentSelect, setContentSelect] = useState('photos');
    const [content, setContent] = useState([])
    const [listUsers, setListUsers] = useState([]);
    const [login, setLogin] = useState(false)


    // utilizamos websocket para crear un evento de abrir y mandamos el nombre de usuario y el url de la imagen para compartir a los demas usuarios conectados
    const logUserStatus = (token) => {
        if (user != null) {
            console.log(user)
            socket.addEventListener('open', () => {
                socket.send(JSON.stringify({
                    "type": "join",
                    "name": user,
                    "image": userImage
                }))
            })
        }
    }


    // utilizamos webSocket para crear un evento en el cual cada vez que se envie un mensaje nuevo desde la api, recibirlo e interpretar la informacion con base a el type

    socket.addEventListener('message', (msg) => {
        const usersChat = JSON.parse(msg.data) // convertimos el json que manda webSocket a un objeto manipulable
        //console.log(usersChat)
        switch (usersChat.type) {
            case "join":
                document.querySelector('.containertChat').innerHTML = ' '; //limpiamos para que cada vez que se actualize muestre los usuarios conectados
                //console.log(usersChat)
                const filterData = usersChat.names.filter((element) => { //filtramos para que no salga mi mismo usuario conectado
                    return (element != user)
                })
                //console.log(usersChat.names.length)
                //if (usersChat.names.length > 1) {
                filterData.forEach((element, id) => { //creamos un forEach para ciclar el arr filtrado y a cada elemento del array crearle su contenedor

                    const userBox = document.createElement('div'); //contenedor del usuario
                    const imageBox = document.innerHTML = `<img src="${usersChat.imageUsers[element]}"/>` //creamos un tag de img y le ponemos la imagen que corresponde por el nombre

                    userBox.classList.add('recipient'); //le agregamos la clase de recipient
                    userBox.setAttribute('userName', element) //creamos un atributo con los nombres de los usuarios por cada ciclo que de el forEach

                    userBox.onclick = async function () { //Creamos un evento de onclick al contenedor del usuario
                        document.getElementById('chatUsersContainer').style.display = 'flex' //cambiamos el display al elemento para que aparesca cuando demos click al contenedor del usuario
                        document.querySelector('.userRecieve').innerText = element; // agregamos el nombre del usuario en el contenedor del chat para saber a quien le enviamos mensaje
                        document.querySelector('.msg').innerHTML = ""; //limpiamos el contenedor de los mensajes para que no aparescan si damos click a otros usuarios

                        const user1 = user;
                        const user2 = userBox.getAttribute('userName');

                        const userChat = await fetch('https://apisocialmedia-oesl.onrender.com/v1/social/getMessage', {
                            method: "post",
                            credentials: "include",
                            headers: {
                                "Content-Type": "Application/json",
                            },
                            body: JSON.stringify({ user1, user2 })
                        }).then((res) => res.json());

                        if (userChat != "EMPTY") {
                            userChat.forEach((element) => {
                                const textUser = element.split("~")
                                const replaceL = textUser[1].replace(/[|]/g, " ");
                                textUser[1] = replaceL

                                if (textUser[0] === user) {
                                    const divChat = document.innerHTML = `<div class="principalUser"><span class="pricipalText">${textUser[0]}: ${textUser[1]}</span></div>`;
                                    document.querySelector('.msg').innerHTML += divChat
                                } else {
                                    const divChat = document.innerHTML = `<div class="recieveUser"><span class="recieveText">${textUser[0]}: ${textUser[1]}</span></div>`;
                                    document.querySelector('.msg').innerHTML += divChat
                                }
                                document.querySelector('.msg').scrollBy({ top: 10000000, behavior: 'smooth' })
                            })
                        }

                    }

                    userBox.innerText = element; //le agregamos el nombre del usuario que nos de el forEach a contenedor de usuario
                    document.querySelector('.containertChat').appendChild(userBox) //le agregamos el elemento contenedor de usuario al contenedor de chats
                    userBox.innerHTML += imageBox; //le agregamos el elemento de la imagen del usuario al contenedor de usuario
                })
                //}

                break;

            case "msg":
                //console.log(usersChat)
                if (usersChat.name === user) {
                    const divChat = document.innerHTML = `<div class="principalUser"><span class="pricipalText">${usersChat.name}: ${usersChat.msg}</span></div>`;
                    document.querySelector('.msg').innerHTML += divChat
                } else if (usersChat.name === document.querySelector('.userRecieve').innerText) {
                    const divChat = document.innerHTML = `<div class="recieveUser"><span class="recieveText">${usersChat.name}: ${usersChat.msg}</span></div>`;
                    document.querySelector('.msg').innerHTML += divChat
                }
                document.querySelector('.msg').scrollBy({ top: 10000000, behavior: 'smooth' })
                break;
        }
    })

    const sendMessage = async (event) => {
        event.preventDefault();

        const msg = event.target[0].value;
        const recieve = document.querySelector('.userRecieve').innerText;
        const principalUser = user;

        const msgSave = {
            user1: principalUser,
            user2: recieve,
            msg: msg
        }

        if (msg.length != 0) {

            const response = await fetch('https://apisocialmedia-oesl.onrender.com/v1/social/saveMessage', {
                method: 'post',
                credentials: "include",
                headers: {
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify(msgSave)
            }).then((res) => res.json())

            if (response === "S") {
                socket.send(JSON.stringify({
                    "type": "msg",
                    "name": principalUser,
                    "recieve": recieve,
                    "msg": msg
                }))
            } else {
                socket.send(JSON.stringify({
                    "type": "msg",
                    "name": principalUser,
                    "recieve": recieve,
                    "msg": 'Error con el servidor'
                }))
            }

            document.querySelector('.sendMsg').value = '';

        }
    }

    /*en el metodo searchin buscamos a los usuarios para agregarlos en la lista de amigos*/
    const searching = async (event) => {

        event.preventDefault();
        const value = document.querySelector('.searchInput').value;

        if (value != "" && value != " ") {

            document.querySelector('.showOptions').setAttribute('show', 'true')
            try {
                const listUsers = await fetch('https://apisocialmedia-oesl.onrender.com/v1/social/getListUsers', {

                    method: 'post',
                    credentials: "include",
                    headers: {
                        'Content-Type': 'Application/json',
                    },
                    body: JSON.stringify({ value, user })

                }).then((res) => res.json());
                setListUsers(listUsers)
            } catch (e) {
                console.log('Something went wrong')
            }
        } else {
            document.querySelector('.showOptions').setAttribute('show', 'false')
        }
    }

    const getContent = useCallback(async () => {
        try {
            //console.log(contentSelect)
            const response = await fetch(`https://apisocialmedia-oesl.onrender.com/v1/social/getContent/${contentSelect}`, {
                method: 'get',
                credentials: "include",
                headers: {
                    "Content-Type": "Application/json",
                }
            }).then((res) => res.json());
            //console.log(response)
            const res = response.reverse();
            setContent(res)

            const videos = document.querySelectorAll('.videoItem');
            videos.forEach((element) => {
                element.pause();
            })
        } catch (error) {

        }

    }, [contentSelect])



    const closeUpload = () => {
        document.getElementById('contentInformation').style.display = "none"
        document.getElementById('selectContent').style.display = "flex";
        document.getElementById('uploadContent').style.display = 'none'
        document.getElementById('showMedia').style.display = 'flex'
        document.querySelector('.titleContent').value = "";
        document.querySelector('.descrip').value = "";
    }

    const logOut = async() => {
        socket.send(JSON.stringify({
            "type": "logout",
            "name": user
        }));
        const logoutRes = await fetch('https://apisocialmedia-oesl.onrender.com/v1/social/logout',{
            method: 'get',
            credentials: "include",
            headers:{
                "Content-Type":"Application/json"
            }
        }).then((res) => res.json());

        if(logoutRes){
            localStorage.removeItem('socialUser');
            localStorage.removeItem('socialImageUser');
            navigate('/login')
        }
        //localStorage.removeItem('tokenSocial');
    }

    const validUser = useCallback(async() =>{
        const login = await fetch('https://apisocialmedia-oesl.onrender.com/v1/social/validToken',{
            method: "get",
            credentials: 'include',
            headers:{
                "Content-Type":"Application/json"
            }
        }).then((res) =>res.json());
        //console.log(login)
        login === "Unauthorized" ? navigate('/login') : "";
        setLogin(true)
    },[])

    useEffect(() => {
        validUser();
        logUserStatus();
        getContent();
    }, [getContent])

    return (
        <>
            <div className="mainContainerMedia">

                {/* -------------------------------------------------------------- PROFILE ------------------------------------------------------------- */}

                <aside className='leftContent'>
                    <section className="userInformation">
                        <div className='profileOptions'>
                            <div className='Options'>
                                <div className='imageUser'>
                                    <button onClick={() => { document.querySelector('.listaOptions').classList.toggle('listaOptionsShow') }} className='photoProfile'><span><img className='photoP' src={userImage} alt="" />{user}</span></button>
                                </div>
                                <div className='uploadContent'>
                                    <button onClick={(event) => { setSelect(event.target.id), document.getElementById('showMedia').style.display = 'none', document.getElementById('uploadContent').style.display = 'flex' }} className='btnUpload' id='Video'><img onClick={(event) => { setSelect(event.target.id), document.getElementById('showMedia').style.display = 'none', document.getElementById('uploadContent').style.display = 'flex' }} id='Video' className='imgUpload' src={uVideo} alt="" /></button>
                                    <button onClick={(event) => { setSelect(event.target.id), document.getElementById('showMedia').style.display = 'none', document.getElementById('uploadContent').style.display = 'flex' }} className='btnUpload' id='Photo'><img onClick={(event) => { setSelect(event.target.id), document.getElementById('showMedia').style.display = 'none', document.getElementById('uploadContent').style.display = 'flex' }} id='Photo' className='imgUpload' src={uPhoto} alt="" /></button>
                                </div>

                            </div>
                            <ul className='listaOptions'>
                                <li className='option'><button className='btnOptions'><span className='optionsSpan'><img className='imgOption' src={perfil} alt="" />Perfil</span></button></li>
                                <li className='option'><button className='btnOptions'><span className='optionsSpan'><img className='imgOption' src={amigos} alt="" />Amigos</span></button></li>
                                <li className='option'><button className='btnOptions'><span className='optionsSpan'><img className='imgOption' src={confi} alt="" />Configuracion</span></button></li>
                                <li className='option'><button className='btnOptions'><span className='optionsSpan'><img className='imgOption' src={soporte} alt="" />Soporte</span></button></li>
                            </ul>
                        </div>
                    </section>
                    <section className="logout">
                        <button onClick={logOut}>
                            <img src={logout} alt="" />LogOut</button>
                    </section>
                </aside>

                {/* --------------------------------------------------------------END PROFILE ------------------------------------------------------------- */}

                {/* ------------------------------------------------------------ HEADER ------------------------------------------------------------- */}

                <header className='headerSearch'>
                    <form className='SearchUser' action="">
                        <input onKeyUp={searching} className='searchInput' type="text" placeholder='Search' />
                        <button onClick={searching} className='btnSubmit' type='submit'><img src={search} alt="" /></button>
                    </form>
                    <section className='showOptions'>
                        <div className="optionsUser">
                            <ul className='containerListUsers'>
                                {listUsers.map((element) => {
                                    return (
                                        <li className='userList'>
                                            <section className='userShowData'>
                                                <img src={element.image} alt="" />
                                                <span>{element.username}</span>
                                            </section>
                                            <section className='addSection'>
                                                <button className='btnAddFriend'><img src={addFriend} alt="" /></button>
                                            </section>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </section>
                </header>

                {/* ------------------------------------------------------------END HEADER ------------------------------------------------------------- */}

                {/* -------------------------------------------------------------- CHAT ------------------------------------------------------------- */}
                <aside className='rightContent'>

                    <section className='containertChat'>

                    </section>
                    <section className="chatUsersContainer" id='chatUsersContainer'>
                        <div className="mainChatContainer">
                            <button className='closeChat' onClick={(event) => document.getElementById('chatUsersContainer').style.display = "none"}>-</button>
                            <div className="showMessage">

                                <section className="userSelected">
                                    <span className='userRecieve'>Name</span>
                                </section>

                                <section className="msg">

                                </section>

                                <form onSubmit={sendMessage} className='writeMessage' action="">
                                    <span className='principalUser'>{user}:</span>
                                    <input className='sendMsg' type="text" placeholder='Write' />
                                    <button type='submit'>send</button>
                                </form>

                            </div>
                        </div>
                    </section>

                </aside>

                {/* --------------------------------------------------------------END CHAT ------------------------------------------------------------- */}

                {/* -------------------------------------------------------------- MainContent ------------------------------------------------------------- */}

                <main className="mainSocial">

                    <section className='uploadContent' id='uploadContent'>
                        <UploadContent select={select} closeUpload={closeUpload} />
                    </section>

                    <section className='showMedia' id='showMedia'>
                        <div className="containerMedia">
                            <section className="selectC">
                                <button onClick={() => setContentSelect('photos')} className='btnC photosC'><img onClick={() => setContentSelect('photos')} src={imageSelect} alt="" /></button>
                                <button onClick={() => setContentSelect('videos')} className='btnC videoC'><img onClick={() => setContentSelect('videos')} src={videoSelect} alt="" /></button>
                            </section>
                            {/* empezar con el componente para obtener el contenido */}
                            <Items content={content} contentSelect={contentSelect} />
                        </div>
                    </section>
                </main>

                {/* --------------------------------------------------------------END MainContent ------------------------------------------------------------- */}
            </div>
        </>
    )
}