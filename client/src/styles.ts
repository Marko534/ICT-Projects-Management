// styles.ts - Shared styles and animations

export const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  @keyframes flipCard {
    0% { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  .animate-slide-in {
    animation: slideIn 0.5s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  .card-container {
    perspective: 1000px;
    min-height: 400px;
    position: relative;
    margin-bottom: 1.5rem;
  }
  
  .card-flip {
    transition: transform 0.6s;
    transform-style: preserve-3d;
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .card-flip.flipped {
    transform: rotateY(180deg);
  }
  
  .card-front, .card-back {
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    background-color: white;
    display: flex;
    flex-direction: column;
  }
  
  .card-back {
    transform: rotateY(180deg);
  }
  
  .animate-fade-in-out {
    animation: fadeIn 0.3s ease-out forwards, fadeIn 0.3s ease-in reverse forwards 2.5s;
  }
  
  .transition-all {
    transition: all 0.3s ease;
  }
`;

export const buttonStyles = {
  primary: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors transform hover:scale-105",
  secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors",
  success: "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors transform hover:scale-105",
  danger: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors",
  small: "px-3 py-1 text-sm rounded"
};

export const cardStyles = {
  container: "bg-white rounded-lg shadow-md p-4 border border-gray-200 transition-all hover:shadow-lg",
  header: "text-lg font-semibold mb-2",
  meta: "text-gray-500 text-sm mb-3"
};

export const formStyles = {
  container: "bg-white rounded-lg shadow-md p-6 border border-gray-200",
  inputGroup: "mb-4",
  label: "block text-gray-700 mb-2",
  input: "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
  error: "mb-4 p-3 bg-red-100 text-red-700 rounded"
};