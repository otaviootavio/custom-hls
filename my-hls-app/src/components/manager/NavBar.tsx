export const Navbar = ({
  setMode,
  currentMode,
}: {
  setMode: React.Dispatch<React.SetStateAction<"user" | "admin">>;
  currentMode: "user" | "admin";
}) => (
  <nav className="bg-blue-500 p-4">
    <div className="flex justify-between">
      <span className="text-white font-bold">Hashchain Manager</span>
      <div>
        <button
          onClick={() => setMode("user")}
          className={`mx-2 ${
            currentMode === "user" ? "text-white" : "text-gray-300"
          }`}
        >
          User Mode
        </button>
        <button
          onClick={() => setMode("admin")}
          className={`mx-2 ${
            currentMode === "admin" ? "text-white" : "text-gray-300"
          }`}
        >
          Admin Mode
        </button>
      </div>
    </div>
  </nav>
);
