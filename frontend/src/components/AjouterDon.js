import { useState } from "react";
import { createDon } from "../Services/donService";

const AjouterDon = () => {
  const [don, setDon] = useState({ titre: "", description: "", ville_don: "", url_image: "" });

  const handleChange = (e) => setDon({ ...don, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createDon(don);
    alert("Don ajouté !");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded">
      <input name="titre" placeholder="Titre" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <textarea name="description" placeholder="Description" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="ville_don" placeholder="Ville" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="url_image" placeholder="Image URL" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Ajouter</button>
    </form>
  );
};

export default AjouterDon;
