import { MasterySearcher } from "./MasterySearcher";
import "./index.css";

export function App() {
  return (
    <div className="max-w-7xl mx-auto p-8 text-center relative z-10">
      <h1 className="text-5xl font-bold my-4 leading-tight">League Mastery Seacher</h1>
      <p>
        Select Region, Type in Summoner Name and Tagline to get started
      </p>
        <MasterySearcher />
    </div>
  );
}

export default App;
