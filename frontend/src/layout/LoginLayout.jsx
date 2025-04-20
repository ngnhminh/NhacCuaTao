import { A } from "@solidjs/router";

const LoginLayout = (props) => {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div class="text-center mb-4">
          <h2 class="text-2xl font-bold text-blue-600">My App</h2>
        </div>

        <div class="space-y-4">
          {props.children} {/* Form đăng nhập sẽ render tại đây */}
        </div>

        <div class="mt-4 text-center">
          <p class="text-sm">
            Don't have an account?{" "}
            <A href="/register" class="text-blue-600 hover:text-blue-800">
              Register here
            </A>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
