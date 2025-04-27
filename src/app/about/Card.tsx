import Image from 'next/image';

interface CardProps {
    imgSrc: string;
    title: string;
  }

const Card: React.FC<CardProps> = ({ imgSrc, title }) => {
    return (    
      <div className="relative shadow-lg bg-primary-400 border border-slate-500 w-1/3 aspect-square rounded hover:animate-pulse ">
        <Image src={imgSrc} alt={title} layout="fill" objectFit="cover" className="rounded" />
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded flex items-center justify-center">
          <span className="text-slate-300 text-2xl font-bold">{title}</span>
        </div>
      </div>
    );
  };
  
  export default Card;