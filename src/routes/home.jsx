import { FaArrowTurnUp } from "react-icons/fa6";
import { useContext } from "react";
import { UserContext } from "../contexts/user";

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="flex h-full justify-center items-center flex-grow">
      <div className="flex flex-col mb-36 text-center w-fit">
        <p className="text-5xl font-black">
          VISUALISE DATA{" "}
          <span className="bg-gradient-to-r from-secondary via-primary to-accent text-transparent bg-clip-text">
            BETTER.
          </span>
        </p>
        <br />
        <p className="text-xl font-bold">
          FinVis combines <span className="text-secondary">financial</span> and{" "}
          <span className="text-accent">news</span> data to make <br />{" "}
          understanding how the news effects stock price simple.
        </p>
      </div>
      {user ? (
        <></>
      ) : (
        <div className="flex flex-row absolute top-20 right-10">
          <p className="text-3xl font-black mr-20 align-middle">
            LOGIN TO GET STARTED{" "}
          </p>
          <FaArrowTurnUp className="text-3xl align-top" />
        </div>
      )}
    </div>
  );
};

export default Home;
