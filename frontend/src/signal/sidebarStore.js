import { createSignal } from "solid-js";

const [showSidebar, setShowSidebar] = createSignal(true);
const [isMinimalView, setIsMinimalView] = createSignal(false); // Thêm state để kiểm tra chế độ hiển thị
const [isSidebarVisible, setIsSidebarVisible] = createSignal(false);

export { showSidebar, setShowSidebar, isMinimalView, setIsMinimalView, isSidebarVisible, setIsSidebarVisible };