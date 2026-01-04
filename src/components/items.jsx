import { useCallback, useEffect, useState } from 'react';
import '../styles/items.css';
import comments from '../assets/comments.svg'

export const Items = ({ content, contentSelect }) => {
    const token = localStorage.getItem('tokenSocial')
    //console.log(content)


    const likeContent = async (event) => {
        console.log(event.target.id)
        try {
            // const response = await fetch(`http://localhost:8080/v1/social/likeContent/${event.target.id}`,{
            //     method: 'post',
            //     headers:{
            //         "Content-Type":"Application/json",
            //         "Authorization":`bearer ${token}`
            //     },
            //     body: JSON.stringify({"type":contentSelect})
            // }).then((res) => res.json());
            console.log(response)
        } catch (e) {

        }
    }

    const videoElement = () =>{
        document.querySelectorAll('.videoItem').forEach((element) =>{
            element.pause()
        })
        
    }

    const showComments = (event) =>{
        console.log(document.getElementById('commentsContainer'))
        document.querySelector('.commentsContainer').classList.toggle('show')
    }

    useEffect(() => {
        document.querySelector('.boxI').scrollBy({ top: 100000000 })
        if (contentSelect === 'photos') {
            document.getElementById('showPhotosItem').style.display = 'block';
            document.getElementById('showVideoItem').style.display = 'none';
        } else {
            document.getElementById('showPhotosItem').style.display = 'none';
            document.getElementById('showVideoItem').style.display = 'flex';
        }
    }, [contentSelect])

    return (
        <>
            <div className="items">

                {/* Photo section */}
                <section className='itemsBox showPhotos' id='showPhotosItem'>
                    <li className='boxI'>
                        {content.map((element, index) => {
                            return (
                                <ul className='item' key={index}>
                                    <input type="hidden" defaultValue={element.id} />
                                    <section className="photoS">
                                        <img className='imageItem' src={element.photo} alt="" />
                                    </section>
                                    <section className="interactionUser">
                                        <div className="info">
                                            <div className="userP">
                                                <span><img className='userPhoto' src={element.userPhoto} alt="" />{element.title}</span>
                                            </div>
                                        </div>
                                        <div className="interaction">
                                            <button className='btnInteration'><svg className='heartBtn' id={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path onClick={likeContent} id={element.id} fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z" /></svg></button>
                                            <button className='btnInteration btnComments'>
                                                <img onClick={showComments} src={comments} alt="" />
                                                <div className="commentsContainer" id='commentsContainer'>
                                                    <div className="showComments">

                                                    </div>
                                                    <form action="">

                                                    </form>
                                                </div>
                                            </button>
                                        </div>
                                    </section>
                                </ul>
                            )
                        })}
                    </li>
                </section>

                {/* Video section */}
                <section className='itemsBox showVideo' id='showVideoItem'>
                    <li className='boxI' onScroll={videoElement}>
                        {content.map((element, index) => {
                            return (
                                <ul className='item' key={index}>
                                    <input type="hidden" defaultValue={element.id} />

                                    <section className="photoS">
                                        <video id='imageItem' controls className='imageItem videoItem' preload='auto' src={element.video}></video>
                                    </section>

                                    <section className="interactionUser">
                                        <div className="info">
                                            <div className="userP">
                                                <span><img className='userPhoto' src={element.userPhoto} alt="" />{element.title}</span>
                                            </div>
                                            <p>{element.description}</p>
                                        </div>
                                        <div className="interaction">
                                            <button className='btnInteration'><svg className='heartBtn' id={index} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path onClick={likeContent} id={element.id} fill="currentColor" d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z" /></svg></button>
                                            <button className='btnInteration commentsBtn'><img src={comments} alt="" /></button>
                                        </div>
                                    </section>
                                </ul>
                            )
                        })}
                    </li>
                </section>
            </div>
        </>
    )
}