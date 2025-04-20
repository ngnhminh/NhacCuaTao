import { Lib } from "../../public/Icon";

const SidebarToggleButton = (props) => {
  return (
    <button
      onClick={props.onClick}
      type="button"
      class="btn btn-circle btn-ghost text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-base-100 dark:hover:text-white"
    >
      <Lib />
      <span class="sr-only">Toggle sidebar</span>
    </button>
  );
};

export default SidebarToggleButton;