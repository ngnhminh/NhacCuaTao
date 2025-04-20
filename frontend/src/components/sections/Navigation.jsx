import { createSignal, onMount, onCleanup } from 'solid-js';

const Navigation = (props) => {
  const [active, setActive] = createSignal(1);

  const items = [
    { id: 1, name: "Tất cả" },
    { id: 2, name: "Nhạc" }, 
    { id: 3, name: "Podcast" },
  ];

  // Gắn sự kiện scroll

  return (
    <div
      class={`px-4 mb-2 sticky top-0 z-50 ease-linear transition-all duration-400  
        ${props.scrolled?.() ? 'bg-base-200 shadow-md' : 'bg-transparent'}`}
    >
      <div class="navbar gap-3">
        {items.map((item) => (
          <button
            class={`btn btn-soft btn-primary h-9 px-3 font-semibold 
              ${active() === item.id ? 'text-primary-content bg-neutral-content' : ''}`}
            onClick={() => setActive(item.id)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
