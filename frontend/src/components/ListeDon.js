import { useEffect, useState } from "react";
import { fetchDons } from "../Services/donService";
import DonDetails from "../pages/DonDetails";

const ListeDon = ({don}) => {
  const [dons, setDons] = useState([]);

  useEffect(() => {
    fetchDons().then(setDons).catch(console.error);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Don</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dons.map(don => (
          <DonDetails key={don._id} don={don} />
        ))}
      </div>
    </div>
  );
};

export default ListeDon;
