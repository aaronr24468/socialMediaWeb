import '../styles/uploadContent.css';
import upload from '../assets/upload.svg'
import { useState } from 'react';
import axios from 'axios';

export const UploadContent = ({ select, closeUpload }) => {
    const user = localStorage.getItem('socialUser');
    const token = localStorage.getItem('tokenSocial')
    const imageUser = localStorage.getItem('socialImageUser');
    const [video, setVideo] = useState('');
    const [photo, setPhoto] = useState('');
    const [flag, setFlag] = useState('');

    const uploadC = async (event) => {
        event.preventDefault();
        const title = event.target[0].value;
        const description = event.target[1].value;
        const info = title.concat(`&${description}`)
        try {
            const formData = new FormData();
            let succesUpload;
            if (flag === 'Video') {
                formData.append('video', video)
                const response = await fetch(`https://apisocialmedia-oesl.onrender.com/v1/social/uploadVideo/${info}`, {
                    method: 'post',
                    headers: {
                        "Authorization": `bearer ${token}`
                    },
                    body: formData
                }).then((res) => res.json())
                succesUpload = response
                setVideo('')
            } else if (flag === 'Photo') {
                formData.append('image', photo);
                const response = await fetch(`https://apisocialmedia-oesl.onrender.com/v1/social/uploadPhoto/${info}`, {
                    method: 'post',
                    headers: {
                        "Authorization": `bearer ${token}`
                    },
                    body: formData
                }).then((res) => res.json())
                succesUpload = response;
                setPhoto('')
            }

            if(succesUpload === 'S'){
                document.querySelector('.titleContent').value="";
                document.querySelector('.descrip').value="";
                closeUpload();
            }else{
                throw new Error("Can not upload the file");
            }
        } catch (e) {

        }
    }

    const getVideoPhoto = (event) => {
        console.log(event.target.files[0].name)
        const nameFileArr = event.target.files[0].name.split('.')
        console.log(nameFileArr)
        if (nameFileArr.find((element) => element === "mp4") || nameFileArr.find((element) => element === "avi")) {
            setVideo(event.target.files[0])
            setFlag('Video')
        } else if (nameFileArr.find((element) => element === "jpg" || nameFileArr.find((element) => element === "png"))) {
            setPhoto(event.target.files[0])
            setFlag('Photo')
        }
        document.getElementById('contentInformation').style.display = "flex"
        document.getElementById('selectContent').style.display = "none"

    }



    return (
        <>
            <div className="uploadContainer" >

                <div className="selectContent" id='selectContent'>
                    <label className='uploadS' htmlFor="upload">
                        <img className='uploadImg' src={upload} alt="" />
                        <span className='selection'>Select the {select}</span>
                    </label>
                    <input onChange={getVideoPhoto} className='uploadInput' type="file" id='upload' />
                </div>
                <div className="contentInformation" id='contentInformation'>

                    <form onSubmit={uploadC} className='getInfo' method="post">
                        <span onClick={closeUpload} className='closeUpload'>x</span>
                        <input className='titleContent' type="text" placeholder='Title' />
                        <textarea className='descrip' placeholder='Description' name="" id=""></textarea>
                        <button className='btnSubmit' type='submit'><img src={upload} alt="" /></button>
                    </form>


                </div>
            </div>
        </>
    )
}