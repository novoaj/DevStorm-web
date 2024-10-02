import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="h-12 w-12">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <radialGradient id="a7" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                    <stop offset="0" stopColor="#D3D9D4"></stop>
                    <stop offset=".3" stopColor="#D3D9D4" stopOpacity=".9"></stop>
                    <stop offset=".6" stopColor="#D3D9D4" stopOpacity=".6"></stop>
                    <stop offset=".8" stopColor="#D3D9D4" stopOpacity=".3"></stop>
                    <stop offset="1" stopColor="#D3D9D4" stopOpacity="0"></stop>
                </radialGradient>
                <circle
                    style={{ transformOrigin: 'center' }}
                    fill="none"
                    stroke="url(#a7)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="200 1000"
                    strokeDashoffset="0"
                    cx="100"
                    cy="100"
                    r="70"
                >
                    <animateTransform
                        type="rotate"
                        attributeName="transform"
                        calcMode="spline"
                        dur="2s"
                        values="360;0"
                        keyTimes="0;1"
                        keySplines="0 0 1 1"
                        repeatCount="indefinite"
                    ></animateTransform>
                </circle>
                <circle
                    style={{ transformOrigin: 'center' }}
                    fill="none"
                    opacity=".2"
                    stroke="#D3D9D4"
                    strokeWidth="12"
                    strokeLinecap="round"
                    cx="100"
                    cy="100"
                    r="70"
                ></circle>
            </svg>
        </div>
    );
};

export default Spinner;