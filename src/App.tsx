import './index.css';

function App() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="mb-8 text-center text-4xl font-bold">
        Hello Bounce Blaster
      </h1>
      <canvas
        id="game-canvas"
        data-testid="game-canvas"
        className="h-[720px] w-[960px] border bg-zinc-800"
      />
    </div>
  );
}

export default App;
