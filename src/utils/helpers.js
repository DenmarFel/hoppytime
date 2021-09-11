import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
    // https://overreacted.io/making-setinterval-declarative-with-react-hooks/
    const savedCallback = useRef();
  
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);
  
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  
  function shuffleArray(array) {
    //https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  function getFormattedDuration(total) {
    // Converts seconds to HH:MM:SS or MM:SS
    let hours = String(Math.floor(total / 3600));
    let minutes = String(Math.floor((total - (Number(hours) * 3600)) / 60));
    let seconds = String(total - (Number(hours) * 3600) - (Number(minutes) * 60));
  
    if (hours > 0) return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    return `${minutes}:${seconds.padStart(2, '0')}`;
  }

  export {
    useInterval,
    shuffleArray,
    getFormattedDuration
  }