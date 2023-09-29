// SiteNavBar.js
import "./index.css"
import "./navbar.css"
import { Button } from '@mui/material'
import LocalGroceryStoreTwoToneIcon from '@mui/icons-material/LocalGroceryStoreTwoTone'
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone'

const SiteNavBar = () => {
  return(
    <div className="navbar">
    <Button size="small" color="primary" aria-label="move row up" style={{padding: '1px'}} href="https://www.nextworldatlas.com">
      <div className="navbar-text">
        <HomeTwoToneIcon fontSize="small"/>
        <div>Next World Atlas Home</div>
      </div>
    </Button>
    <Button size="small" color="primary" aria-label="move row up" style={{padding: '1px'}} href="https://www.etsy.com/shop/nextworldatlas">
      <div className="navbar-text">
        <LocalGroceryStoreTwoToneIcon fontSize="small"/>
        <div>Shop Next World Atlas</div>
      </div>
    </Button>
    </div>
  )
}
 
export default SiteNavBar