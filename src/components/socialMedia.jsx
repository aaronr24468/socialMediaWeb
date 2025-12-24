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
import { UploadContent } from './uploadContent';
import { Items } from './items';


export const MainSocialMedia = ({ }) => {
    const socket = new WebSocket('ws://localhost:8181')
    const navigate = useNavigate();
    const user = localStorage.getItem('socialUser');
    const userImage = localStorage.getItem('socialImageUser');

    const [select, setSelect] = useState(null);
    const [contentSelect, setContentSelect] = useState('photos');
    const [content, setContent] = useState([])


    socket.addEventListener('open', () => {
        socket.send(JSON.stringify({
            "type": "join",
            "name": user,
            "image": userImage
        }))
    })

    socket.addEventListener('message', (msg) => {
        const usersChat = JSON.parse(msg.data) // convertimos el json que manda webSocket a un objeto manipulable
        //console.log(usersChat)
        
        switch (usersChat.type) {
            case "join":
                document.querySelector('.containertChat').innerHTML = ' '; //limpiamos para que cada vez que se actualize muestre los usuarios conectados
                //console.log(usersChat.names.length)
                const filterData = usersChat.names.filter((element) => { //filtramos para que no salga mi mismo usuario conectado
                    return (element != user)
                })
                //console.log(usersChat.names.length)
                //if (usersChat.names.length > 1) {
                filterData.forEach((element, id) => { //creamos un forEach para ciclar el arr filtrado y a cada elemento del array crearle su contenedor
                    const userBox = document.createElement('div');
                    const imageBox = document.innerHTML = `<img src="${usersChat.imageUsers[element]}"/>` //creamos un tag de img y le ponemos la imagen que corresponde por el nombre

                    userBox.classList.add('recipient');
                    userBox.setAttribute('userName', element)

                    userBox.onclick = async function () {
                        document.getElementById('chatUsersContainer').style.display = 'flex'
                        document.querySelector('.userRecieve').innerText = element
                        document.querySelector('.msg').innerHTML = ""

                    }

                    userBox.innerText = element;
                    document.querySelector('.containertChat').appendChild(userBox)
                    userBox.innerHTML += imageBox
                })
                //}

                break;

            case "msg":
                console.log(usersChat)
                if (usersChat.name === user) {
                    const divChat = document.innerHTML = `<div class="principalUser"><span class="pricipalText">${usersChat.name}: ${usersChat.msg}</span></div>`;
                    document.querySelector('.msg').innerHTML += divChat
                } else {
                    const divChat = document.innerHTML = `<div class="recieveUser"><span class="recieveText">${usersChat.name}: ${usersChat.msg}</span></div>`;
                    document.querySelector('.msg').innerHTML += divChat
                }
                document.querySelector('.msg').scrollBy({top: 10000000, behavior: 'smooth'})
                break;
        }
    })

    const sendMessage = (event) => {
        event.preventDefault();
        const msg = event.target[0].value;
        const recieve = document.querySelector('.userRecieve').innerText;
        const principalUser = user;
        if (msg.length != 0) {
            socket.send(JSON.stringify({
                "type": "msg",
                "name": principalUser,
                "recieve": recieve,
                "msg": msg
            }))
            document.querySelector('.sendMsg').value = '';
            
        }
    }

    const searching = (event) => {
        event.preventDefault();
        const value = document.querySelector('.searchInput').value;

        if (value != "" && value != " ") {
            document.querySelector('.showOptions').setAttribute('show', 'true')
        } else {
            document.querySelector('.showOptions').setAttribute('show', 'false')
        }
    }

    const getContent = useCallback(async () => {
        try {
            //console.log(contentSelect)
            const response = await fetch(`http://localhost:8080/v1/social/getContent/${contentSelect}`, {
                method: 'get',
                headers: {
                    "Content-Type": "Application/json",
                    "Authorization": `bearer ${localStorage.getItem('tokenSocial')}`
                }
            }).then((res) => res.json());
            //console.log(response)
            const res = response.reverse();
            setContent(res)

            const videos = document.querySelectorAll('.videoItem');
            videos.forEach((element) =>{
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

    const logOut = () => {
        socket.send(JSON.stringify({
            "type": "logout",
            "name": user
        }));

        localStorage.removeItem('tokenSocial');
        localStorage.removeItem('socialUser');
        localStorage.removeItem('socialImageUser');
        navigate('/login')
    }

    useEffect(() => {
        const token = localStorage.getItem('tokenSocial')
        token === null ? navigate('/login') : ""
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
                        <div className="options">

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