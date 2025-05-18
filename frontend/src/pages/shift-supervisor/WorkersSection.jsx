import { useState } from "react";

const testData = [
  {
    id: 6,
    full_name: "kkkkkkkkkk",
    email: "kkkk@aaa.com",
    img_profile:
      "https://res.cloudinary.com/dnt2jlkno/image/upload/c_fit,h_250,w_250/v1747051288/users_avatar/kkkk%40aaa.com/t4jroig1fiitr4cxbynj",
  },
  {
    id: 9,
    full_name: "TECHNICIAN",
    email: "yipav44034@hazhab.com",
    img_profile:
      "https://res.cloudinary.com/dnt2jlkno/image/upload/c_fit,h_250,w_250/v1747242801/users_avatar/yipav44034%40hazhab.com/keht7rigskdbwttqi1cn",
  },
];

export default function WorkersSection() {
  const [workers, setWorkers] = useState(testData);

  // useEffect(() => {
  //   getWorkers().then(setWorkers);
  // }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">👷‍♂️ Працівники</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {workers.map((worker) => (
          <div key={worker.id} className="border rounded p-3 shadow-sm bg-white">
            <img src={worker.img_profile} alt={worker.full_name} className="w-16 h-16 rounded-full mb-2" />
            <p className="font-medium">{worker.full_name}</p>
            <p className="text-sm text-gray-500">{worker.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
