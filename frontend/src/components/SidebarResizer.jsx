import { setIsMinimalView, isMinimalView, setShowSidebar } from "../signal/sidebarStore";

const SidebarResizer = ({ sidebarRef, setSidebarWidth }) => {
  const startResize = (e) => {
    document.body.style.userSelect = "none";
    let isDragging = false;

    sidebarRef.classList.add("transition-none");

    const onMouseMove = (e) => {
      if (!isDragging) {
        isDragging = true;
        document.body.classList.add("force-grabbing");
      }
      const newWidth = e.clientX;
      if (newWidth >= 300 && newWidth <= 1000) {
        sidebarRef.style.width = `${newWidth}px`;
        setSidebarWidth(`${newWidth}px`);

        if (newWidth > 72 && isMinimalView()) {
          setIsMinimalView(false); // Chuyển sang chế độ đầy đủ
          setShowSidebar(true); // Hiện sidebar
        } else if (newWidth <= 72 && !isMinimalView()) {
          setIsMinimalView(true); // Chuyển sang chế độ tối giản
        }
      }
    };

    const onMouseUp = () => {
      document.body.classList.remove("force-grabbing");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.userSelect = "";
      sidebarRef.classList.remove("transition-none");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div
      class="absolute top-0 right-0 w-2 h-full cursor-grab active:cursor-grabbing z-1 bg-transparent hover:bg-base-100 active:bg-base-100 transition"
      onMouseDown={startResize}
    />
  );
};

export default SidebarResizer;