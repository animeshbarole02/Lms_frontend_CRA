import './button.css'

const Button = ({onClick , text , active ,className }) => {
  return (
    <div className="button-component-div" > 
      
        <button 
         
          className={`custom-button ${active ? 'active':''} ${className}`}
          onClick={onClick}
        >

          {text}
        </button>
        
        

    </div>
  )
}

export default Button