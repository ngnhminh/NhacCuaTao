import { createSignal } from "solid-js";
import toast from "solid-toast";
import { useNavigate } from "@solidjs/router";

export default function AdminLogin() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email() || !password()) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // try {
    //   const res = await adminLoginService(email(), password());
    //   if (res?.token) {
    //     localStorage.setItem("adminToken", res.token);
    //     toast.success("Đăng nhập thành công!");
    //     navigate("/admin/dashboard");
    //   } else {
    //     toast.error("Email hoặc mật khẩu không đúng!");
    //   }
    // } catch (err) {
    //   toast.error("Đã xảy ra lỗi, vui lòng thử lại.");
    //   console.error(err);
    // }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-900">
      <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Đăng nhập Admin</h2>
        <input
          class="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Email"
          onInput={(e) => setEmail(e.target.value)}
        />
        <input
          class="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="password"
          placeholder="Mật khẩu"
          onInput={(e) => setPassword(e.target.value)}
        />
        <button
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition"
          onClick={handleLogin}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
