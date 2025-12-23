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
    const ws = new WebSocket('ws://localhost:8181')
    const navigate = useNavigate();
    const user = localStorage.getItem('socialUser');
    const userImage = localStorage.getItem('socialImageUser');
    const [select, setSelect] = useState(null);
    const [contentSelect, setContentSelect] = useState('photos');
    const [content, setContent] = useState([])

    ws.addEventListener('open', () => {
        ws.send(JSON.stringify({
            "type": "join",
            "name": user,
            "image": userImage
        }))
    })

    const searching = (event) => {
        event.preventDefault();
        const value = document.querySelector('.searchInput').value;

        if (value != "" && value != " ") {
            document.querySelector('.showOptions').setAttribute('show', 'true')
        } else {
            document.querySelector('.showOptions').setAttribute('show', 'false')
        }
    }

    const getContent = useCallback(async()=>{
        try {
            console.log(contentSelect)
            const response = await fetch(`http://localhost:8080/v1/social/getContent/${contentSelect}`,{
                method: 'get',
                headers:{
                    "Content-Type":"Application/json",
                    "Authorization":`bearer ${localStorage.getItem('tokenSocial')}`
                }
            }).then((res) => res.json());
            console.log(response)
            const res = response.reverse();
            setContent(res)
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
        ws.send(JSON.stringify({
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
    },[getContent])

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
                            <Items content={content} contentSelect={contentSelect}/> 
                        </div>
                    </section>
                </main>

                {/* --------------------------------------------------------------END MainContent ------------------------------------------------------------- */}
            </div>
        </>
    )
}