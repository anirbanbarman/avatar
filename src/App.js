
import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [avatarUrl,setAvatarUrl]=useState("")
  const [__avatarUrl,__setAvatarUrl]=useState({name:""})

  useEffect(() => {
    setAvatarUrl("")

  
    const subdomain = 'demo'; // Replace with your custom subdomain
    const frame = document.getElementById('frame');
     frame.src = `https://${subdomain}.readyplayer.me/avatar?frameApi`;
     function subscribe(event) {
      const json = parse(event);

      if (json?.source !== 'readyplayerme') {
        return;
      }

      // Susbribe to all events sent from Ready Player Me once frame is ready
      if (json.eventName === 'v1.frame.ready') {
      
        frame.contentWindow.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**'
          }),
          '*'
        );
      }

      // Get avatar GLB URL
      if (json.eventName === 'v1.avatar.exported') {
        
 
 
        console.log(`Avatar URL: ${json.data.url}`);
        setAvatarUrl(json.data.url)
        __setAvatarUrl({name:json.data.url})
        // document.getElementById('frame').hidden = true;
        // displayIframe();
     
      }

      // Get user id
      if (json.eventName === 'v1.user.set') {
   
        console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
      }
    }

    function parse(event) {
      try {
        return JSON.parse(event.data);
      } catch (error) {
        return null;
      }
    }

    function displayIframe() {
      document.getElementById('frame').hidden = false;
    }

     
    window.addEventListener('message', subscribe);
    document.addEventListener('message', subscribe);
    return () => {
      window.removeEventListener('message', subscribe);
      document.removeEventListener('message', subscribe);
    };

    

    

  },
 [avatarUrl,setAvatarUrl]);
  return (<>
      {__avatarUrl.name && <div> <h3 style={{textAlign:"center"}}>{`Your Avatar url is `} : <mark>{`${__avatarUrl.name}`}</mark></h3></div>}
    <div style={{display:'flex',justifyContent:"center",alignItems:"center"}} >
      <iframe title='avatar' id="frame" className="frame" allow="camera *; microphone *"></iframe>

    </div>
    </>
  );
}

export default App;
