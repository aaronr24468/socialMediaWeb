import '../styles/register.css';
import eye from '../assets/eye.svg'
import imageSelect from '../assets/uploadImage.png'
import { useNavigate } from 'react-router';
import { useState } from 'react';

export const RegisterComponent = ({ }) => {
    const navigate = useNavigate();

    const [image, setImage] = useState('')

    const getPhoto = (event) => {
        console.log(event.target.files)
        setImage(event.target.files[0])
    }

    const registerData = async (event) => {
        event.preventDefault();
        const data = {
            name: event.target[0].value,
            lastname: event.target[1].value,
            username: event.target[2].value,
            password: event.target[3].value,
            day: event.target[4].value,
            month: event.target[5].value,
            year: event.target[6].value,
        }
        console.log(data)
        try {
            const formData = new FormData();
            formData.append('image', image)
            const response = await fetch('https://apisocialmedia-oesl.onrender.com/register', {
                method: 'put',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
            ).then((res) => res.json());
            if (response === "S") {
                setTimeout(async() => {
                    const res = await fetch(`https://apisocialmedia-oesl.onrender.com/register/setPhoto/${data.username}`, {
                        method: 'post',
                        body: formData
                    }).then((res) => res.json());
                }, 500)
                navigate('/login')
            } else {
                throw ErrorEvent('No se pudo realizar registro')
            }
        } catch (e) {
            alert("No se pudo realizar registro")
        }
    }

    return (
        <>
            <div className="mainRegister">
                <form onSubmit={registerData} method='post' className="RegisterContainer">
                    <section className="register leftR">
                        <div className="leftBox">
                            <span>Name</span>
                            <input type="text" placeholder='Enter your name' />
                        </div>
                        <div className="leftBox">
                            <span>Lastname</span>
                            <input type="text" placeholder='Enter your lastname' />
                        </div>
                    </section>
                    <section className="register rightR">
                        <div className="rightBox">
                            <span>Username</span>
                            <input type="text" placeholder='Set your username' />
                        </div>
                        <div className="rightBox">
                            <span>Password</span>
                            <input id='passUser' type="password" placeholder='Set your password' />
                            <img className='btnEyeShow' src={eye} alt="" onClick={() => document.getElementById('passUser').type === "password" ? document.getElementById('passUser').type = "text" : document.getElementById('passUser').type = "password"} />
                        </div>
                    </section>
                    <section className='register date'>
                        <div className="dateBox">
                            <input type="text" list='day' placeholder='day' />
                            <datalist id='day'>
                                <option value="01"></option>
                                <option value="02"></option>
                                <option value="03"></option>
                                <option value="04"></option>
                                <option value="05"></option>
                                <option value="06"></option>
                                <option value="07"></option>
                                <option value="08"></option>
                                <option value="09"></option>
                                <option value="10"></option>
                                <option value="11"></option>
                                <option value="12"></option>
                                <option value="13"></option>
                                <option value="14"></option>
                                <option value="15"></option>
                                <option value="16"></option>
                                <option value="17"></option>
                                <option value="18"></option>
                                <option value="19"></option>
                                <option value="20"></option>
                                <option value="21"></option>
                                <option value="22"></option>
                                <option value="23"></option>
                                <option value="24"></option>
                                <option value="25"></option>
                                <option value="26"></option>
                                <option value="27"></option>
                                <option value="28"></option>
                                <option value="29"></option>
                                <option value="30"></option>
                                <option value="31"></option>
                            </datalist>

                            <input type="text" list='month' placeholder='month' />
                            <datalist id='month'>
                                <option value="01"></option>
                                <option value="02"></option>
                                <option value="03"></option>
                                <option value="04"></option>
                                <option value="05"></option>
                                <option value="06"></option>
                                <option value="07"></option>
                                <option value="08"></option>
                                <option value="09"></option>
                                <option value="10"></option>
                                <option value="11"></option>
                                <option value="12"></option>
                            </datalist>
                            <input type="text" placeholder='Year' />
                        </div>
                        <div className="uploadPhoto">
                            <label className='uploadLabel' htmlFor="photoInput">
                                <img className='imageUpload' src={imageSelect} alt="" />
                            </label>
                            <input onChange={getPhoto} className='inputP' type="file" id='photoInput' />
                        </div>
                        <button className='btnRegister' type='submit'>Register</button>
                    </section>
                </form>
            </div>
        </>
    )
}