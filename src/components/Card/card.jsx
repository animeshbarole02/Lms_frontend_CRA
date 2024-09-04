
import './card.css';

const Card = ({ heading, count, src,className }) => {
  return (

   
    <div className={`card-container ${className}`}>
            <h3 className='card-heading'>{heading}</h3>
            <p className='card-count'>{count}</p>
      <img src={src} alt="" />

    </div>
   
  );
};

export default Card;