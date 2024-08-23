export const Navbar = ({
  setMode,
  currentMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<"user" | "admin">>;
  currentMode: "user" | "admin";
}) => (
  <nav className="bg-blue-500 p-2 ">
    <div className="flex flex-col justify-between">
      <div className="flex flex-row justify-between">
        <button
          onClick={() => setMode("user")}
          className={` bg-blue-700 p-2 ${
            currentMode === "user" ? "text-white" : "text-gray-300"
          }`}
        >
          User Mode
        </button>
        <button
          onClick={() => setMode("admin")}
          className={` bg-blue-700 p-2 ${
            currentMode === "admin" ? "text-white" : "text-gray-300"
          }`}
        >
          Admin Mode
        </button>
      </div>
    </div>
  </nav>
);
