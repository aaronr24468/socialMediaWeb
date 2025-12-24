import '../styles/login.css';
import eye from '../assets/eye.svg'
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

export const LoginComponent = ({ }) => {
    const navigate = useNavigate();
    //obtenermos el dom del input de password para poder manipular atributos

    //creamos un metodo el cual nos le asignaremos el onSubmit para obtener los datos del usuario y pedir el token de la cuenta
    const setLogin = async(event) => {

        event.preventDefault();
        const data = {
            username: event.target[0].value,
            password: event.target[1].value
        }
        
        const token = await fetch('http://localhost:8080/login',{
            method: 'post',
            headers:{
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(data)
        }).then((res) => res.json())
        
        //console.log(token)

        if(token != "F"){
            const user = await fetch('http://localhost:8080/v1/social/getUser',{
                method: 'get',
                headers:{
                    "Content-Type": "Application/json",
                    "Authorization": `bearer ${token}`
                }
            }).then((res) => res.json());
            //console.log(user)
            localStorage.setItem('tokenSocial', token);
            localStorage.setItem('socialUser', user.username);
            localStorage.setItem('socialImageUser', user.image);
            navigate('/SocialMedia')
        }else{
            alert('El usuario no se encontro');
        }
    }

    useEffect(() =>{
        const token = localStorage.getItem('tokenSocial')
        //console.log(token)
        if(token != null){
            navigate('/SocialMedia')
        }
    },[])

    return (
        <>
            <div className="mainContaner">
                <div className="container">
                    <div className="box">
                        <h1>Welcome<br />SocialMedia 👋🏻</h1>
                        <p>The website that you can post all that you want and share with <br /> all you're friends and family</p>
                    </div>
                    <div className="box2">
                        <h2 className='welcomeLogin'>Welcome to SocialMedia</h2>
                        <p className='registerP'>Don't have an account <a className='registerA' onClick={()=> navigate('/register')}>Register for free</a> and enjoy the platform</p>
                        <form className='dataInput' onSubmit={setLogin} method="post">
                            <div className="containerInputs">
                                <div className="dataC email">
                                    <input type="text" placeholder='Username' />
                                </div>
                                <div className="dataC pass">
                                    <input type="password" id='show' placeholder='Password' />
                                    <img className='eye' onClick={()=> document.getElementById('show').type === 'password'? document.getElementById('show').type="text":document.getElementById('show').type="password"} src={eye} alt="" />
                                </div>
                            </div>
                            <button className='submitBtn' type='submit'>Login</button>
                        </form>
                        <span className='forgot'>Forgot password <a href="/password/reset">Click here</a> </span>
                    </div>
                </div>
            </div>
        </>
    )
}