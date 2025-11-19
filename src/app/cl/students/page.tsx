import { getCl_code, getStudentsUnderCL } from "@/app/actions/actions";
import ManageStudents from "./ManageStudents";

const page = async () => {
  const res = await getStudentsUnderCL();
  const {data} = await getCl_code()

  return (
    <div className="container max-w-7xl py-8 mx-auto">
      <ManageStudents students={res.data} cl_code={data.cl_code} />
    </div>
  );
};

export default page;
