import { AuthApi } from "@/lib/apis/auth/auth-api";
import { KaryawanApi } from "./employee/employee-api";

const authApi = new AuthApi();
const karyawanApi = new KaryawanApi();


export { authApi, karyawanApi };
