type Props = {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
};

const Sidebar = ({ selectedTab, setSelectedTab }: Props) => {
  return (
    <div className="py-6">
      <div className="flex gap-3 items-center justify-center mb-10">
        <img src="./logo.svg" alt="logo" className="w-20" />
        <div className="text-2xl font-semibold text-center">
          QuickFill
        </div>
      </div>
      <nav>
        <ul className="space-y-3 text-center">
          <li
            className={`text-base ${selectedTab === "overview" ? "text-bbWhite font-medium " : "text-[#A1A1AA] hover:underline"} cursor-pointer`}
            onClick={() => setSelectedTab("overview")}
          >
            Overview
          </li>
          <li
            className={`text-base ${selectedTab === "order" ? "text-bbWhite font-medium" : "text-[#A1A1AA] hover:underline"}  cursor-pointer`}
            onClick={() => setSelectedTab("order")}
          >
            Preference Order
          </li>
          {/* <li
            className={`text-base ${selectedTab === "trash" ? "text-bbWhite font-medium" : "text-[#A1A1AA] hover:underline"}  cursor-pointer`}
            onClick={() => setSelectedTab("trash")}
          >
            Trash
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
