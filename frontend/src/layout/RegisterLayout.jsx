import { A } from "@solidjs/router";
import Register from "../pages/Register";

const RegisterLayout = () => {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <div class="text-center mb-4">
        </div>

        <div class="space-y-4">
          <Register/> {/* Form đăng ký sẽ được render tại đây */}
        </div>

        <div class="mt-4 text-center">
          <p class="text-sm">
            Đã có tài khoản?{" "}
            <A href="/login" class="text-green-600 hover:text-green-800">
              Đăng nhập
            </A>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
