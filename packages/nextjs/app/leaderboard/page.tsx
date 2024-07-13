import type { NextPage } from "next";

const Leaderboard: NextPage = () => {
  return (
    <div className="p-10">
      <div className="overflow-x-auto">
        <table className="table bg-primary rounded-lg">
          {/* head */}
          <thead className="bg-gray-200">
            <tr className="font-bold">
              <th className="rounded-tl-lg"></th>
              <th>Address</th>
              <th>Games Won</th>
              <th className="rounded-tr-lg">Chain</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="bg-white">
              <th>1</th>
              <td>vitalik.eth</td>
              <td>2</td>
              <td>Base</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
