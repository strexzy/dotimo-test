import { Board } from "./components/playground/board";
import { ThemeProvider } from "./components/ui/theme-provider";
import { ThemeToggle } from "./components/ui/theme-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-full min-h-screen bg-secondary flex flex-col justify-center items-center gap-10">
        <div className="flex gap-4 items-center">
          <h1 className="text-5xl text-primary font-bold">Dotimo test</h1>
          <ThemeToggle />
        </div>
        <Board />
      </div>
    </ThemeProvider>
  );
}

export default App;
