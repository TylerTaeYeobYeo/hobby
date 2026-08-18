import { Center } from "@core/ui";
import { Outlet } from "react-router";

export const App = () => {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-between">
      <Center className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Sudoku</h1>
        <Outlet />
      </Center>
    </main>
  );
};
