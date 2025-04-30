// components/SidebarLeftResizer.jsx
import { onCleanup, onMount } from 'solid-js';

const SidebarLeftResizer = ({ sidebarRef, setSidebarWidth }) => {
    let resizerRef;

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarRef.offsetWidth;

        const handleMouseMove = (e) => {
            const newWidth = startWidth + (startX - e.clientX);
            const clampedWidth = Math.min(420, Math.max(280, newWidth));
            setSidebarWidth(`${clampedWidth}px`);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            ref={resizerRef}
            className="absolute left-0 top-0 h-full w-2 cursor-col-resize z-10"
            onMouseDown={handleMouseDown}
        ></div>
    );
};

export default SidebarLeftResizer;
