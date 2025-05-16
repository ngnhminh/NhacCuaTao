import { Lib } from "../../public/Icon";

const SidebarToggleButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      type="button"
      class="btn btn-circle btn-ghost bg-black text-white hover:bg-white hover:text-black"
    >
      <Lib />
      <span class="sr-only">Toggle sidebar</span>
    </button>
  );
};

export default SidebarToggleButton;