import { useParams } from "react-router-dom";

const Application = () => {
  const id = useParams().id || "";

  return (
    <>
      <h1>Detail</h1>
      <p>{id}</p>
    </>
  );
};

export default Application;