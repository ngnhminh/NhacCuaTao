import { createSignal } from "solid-js";
import { loginService } from "/./services/authService";
import toast from 'solid-toast';
import { useNavigate } from "@solidjs/router";
import { useAuth } from "../layout/AuthContext";

const Login = () => {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const navigate = useNavigate();
  const auth = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService({ email: email(), password: password() });
      // console.log("Login success:", data);
      if(data){
        auth.setIsLoggedIn(true);
        toast.success("Đăng nhập thành công!");
      }else{
        toast.error("Đăng nhập thất bại");
      }
      navigate("/");
    } catch (err) {
      alert("Đăng nhập thất bại!");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      {/* Input Email */}
      <div>
        <label for="email" class="block text-sm font-semibold">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Enter your email"
          required
        />
      </div>

      {/* Input Password */}
      <div>
        <label for="password" class="block text-sm font-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
          class="w-full p-3 border border-gray-300 rounded-md"
          placeholder="Enter your password"
          required
        />
      </div>

      {/* Button Login */}
      <div>
        <button
          type="submit"
          class="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    </form>
  );
};

export default Login;
