import { createSignal } from "solid-js";
import { registerService } from "/services/registerService.js";
import { useNavigate } from '@solidjs/router';

export default function Register(){
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const result = await registerService({
        name: name(),
        email: email(),
        password: password(),
      });
      console.log("Register success:", result);
      navigate("/");
    }
    catch(err){
      alert("Đăng kí thất bại!");
      console.error(err);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        class="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 class="text-2xl font-bold text-center text-gray-800">Đăng ký</h2>

        <input
          type="text"
          placeholder="Họ tên"
          value={name()}
          onInput={(e) => setName(e.currentTarget.value)}
          class="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          class="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password()}
          onInput={(e) => setPassword(e.currentTarget.value)}
          class="w-full p-2 border border-gray-300 rounded-lg"
          required
        />

        <button
          type="submit"
          class="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
