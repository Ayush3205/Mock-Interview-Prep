<<<<<<< HEAD
import Agent from '@/components/Agent'
import { getCurrentUser } from '@/lib/actions/auth.action'

const page = async () => {
  const user = await getCurrentUser();
=======
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();

>>>>>>> 30c88d4406bf086a6318d5697bc1bed5bb568913
  return (
    <>
      <h3>Interview generation</h3>

<<<<<<< HEAD
        <Agent 
          userName={user?.name} 
          userId={user?.id} 
          type="generate" 
        />
=======
      <Agent
        userName={user?.name!}
        userId={user?.id}
        profileImage={user?.profileURL}
        type="generate"
      />
>>>>>>> 30c88d4406bf086a6318d5697bc1bed5bb568913
    </>
  );
};

export default Page;
