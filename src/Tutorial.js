// Tutorial.js
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded'

const Tutorial = ({children, setShowTutorial, setTutorialID}) => {
  return (
    <>
    <div className="tutorial-overlay">
      <div className="button-tutorial button-tutorial-next" onClick={()=>{setTutorialID(prev=>(prev+1)%3)}}><ArrowForwardIosRoundedIcon/></div>
      <div className="button-tutorial button-tutorial-prev" onClick={()=>{setTutorialID(prev=>(prev+2)%3)}}><ArrowBackIosNewRoundedIcon/></div>
      <div className="button-close" onClick={()=>setShowTutorial(prev=>!prev)}>Close</div>
      <div className="tutorial-container">
        {children}
      </div>
    </div>
    </>
  )
}

export default Tutorial