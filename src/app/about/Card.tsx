interface CardProps {
    imgSrc: string;
    title: string;
  }

const Card: React.FC<CardProps> = ({ imgSrc, title }) => {
    return (
      <div className="relative shadow-lg bg-primary-400 border border-slate-500 rounded hover:animate-pulse ">
        <img src={imgSrc} alt={title} className="w-full object-cover rounded " />
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded flex items-center justify-center">
          <span className="text-slate-300 text-2xl font-bold">{title}</span>
        </div>
      </div>
    );
  };
  
  export default Card;