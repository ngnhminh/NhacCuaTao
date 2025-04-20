import { createSignal, onCleanup  } from "solid-js";
export const highlightMatch = (text, query) => {
    if (!query) return text;
  
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
  
    const before = text.slice(0, index);
    const match = text.slice(index, index + query.length);
    const after = text.slice(index + query.length);
  
    return (
      <>
        {before}
          <span class="inline-block bg-info/70 rounded-md font-semibold">{match}</span>
        {after}
      </>
    );
  }

  export const useActive = (initialState = false) => {
    const [active, setActive] = createSignal(initialState);
  
    const toggleActive = () => setActive(!active());
  
    return { active, toggleActive, setActive };
  }

  export const useFullscreen = (targetRef = () => document.documentElement) =>
  {
    const [isFullscreen, setIsFullscreen] = createSignal(false);
  
    function toggle() {
      const target = targetRef();
      if (!target) return;
  
      if (!document.fullscreenElement) {
        target.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  
    function onChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
  
    document.addEventListener("fullscreenchange", onChange);
    onCleanup(() => document.removeEventListener("fullscreenchange", onChange));
  
    return { isFullscreen, toggle };
  }


  

  