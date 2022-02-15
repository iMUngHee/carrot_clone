import { NextPage } from "next";

const Chats: NextPage = () => {
  return (
    <div className="divide-y-[1px] py-10">
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 px-4 py-3">
          <div className="h-12 w-12 rounded-full bg-slate-300" />
          <div>
            <p className="cursor-pointer text-gray-700">Steve Jebs</p>
            <p className="text-sm text-gray-500">
              내일 오후 2시에 모퉁이에서 만나요...
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
