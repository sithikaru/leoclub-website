import { NextPage } from "next";

const Achievements: NextPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Achievements & Awards</h1>
      <ul className="list-disc ml-6">
        <li>Community Service Award, 2023</li>
        <li>Best Leo Club in District, 2022</li>
        <li>XYZ Volunteer Excellence Recognition</li>
      </ul>
    </div>
  );
};

export default Achievements;
