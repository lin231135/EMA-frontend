import { RegisterFormCard, RegisterImageCard } from "../forms/RegisterCards";
import PageLayout from "../layout/PageLayout";

const Register = () => {
  return (
    <PageLayout hideUserMenu={true}>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch justify-center gap-8">
          <RegisterImageCard />
          <RegisterFormCard />
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;
